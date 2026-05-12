/**
 * Juventude NV - Google Sheets Integration
 * Versão: 3.0.0
 *
 * Melhorias em relação à v2.5:
 *  - Busca somente a categoria solicitada no Sanity (query filtrada)
 *  - Migração não-destrutiva de colunas: perguntas removidas preservam histórico
 *  - Correção de falsy values (0, false) no mapeamento de respostas
 *  - Sanitização de GROQ injection via allowlist de caracteres
 *  - Sanitização de fórmulas extendida para todos os campos (incluindo nome, email, telefone)
 */

// ─── ENTRY POINT ────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var data = JSON.parse(e.postData.contents);

    // 1. TOKEN DE SEGURANÇA
    var secretToken = props.getProperty('FORM_TOKEN');
    if (!data.token || data.token !== secretToken) {
      return jsonResponse({ error: "Acesso Negado", code: 401 });
    }

    // 2. VALIDAR E NORMALIZAR CATEGORIA
    var sentCategory = normalizeCategory(data.category);
    if (!sentCategory) {
      return jsonResponse({ error: "Categoria inválida ou ausente", code: 400 });
    }

    // 3. BUSCAR SOMENTE A CATEGORIA NECESSÁRIA NO SANITY
    var categoryData = getSanityCategoryByLabel(props, sentCategory);
    if (!categoryData) {
      return jsonResponse({ error: "Categoria não encontrada: " + sentCategory, code: 404 });
    }

    // 4. ACESSAR OU CRIAR ABA NA PLANILHA
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = categoryData.label;
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    // 5. COLUNAS FIXAS + COLUNAS DINÂMICAS DAS PERGUNTAS ATUAIS
    var fixedHeaders = ["Data", "Nome", "Email", "Telefone"];
    var questions = categoryData.questions || [];
    var newDynamicHeaders = questions.map(function(q) { return q.label; });

    // 6. MIGRAÇÃO NÃO-DESTRUTIVA DE CABEÇALHOS
    //    - Mantém colunas existentes (histórico)
    //    - Adiciona colunas novas à direita
    //    - Nunca remove colunas com dados
    var finalHeaders = mergHeaders(sheet, fixedHeaders, newDynamicHeaders);

    // 7. MONTAR E SALVAR A LINHA
    var newRow = buildRow(finalHeaders, fixedHeaders, questions, data);
    sheet.appendRow(newRow);

    return jsonResponse({ message: "Sucesso", category: sheetName, code: 200 });

  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Erro no processamento", details: err.toString(), code: 500 });
  }
}

// ─── SANITY ──────────────────────────────────────────────────────────────────

/**
 * Busca SOMENTE a categoria cujo label (case-insensitive) corresponde ao enviado.
 * A filtragem acontece na query GROQ — não traz todas as categorias para o script.
 *
 * @param {GoogleAppsScript.Properties.Properties} props
 * @param {string} normalizedLabel  Label já validado e em lowercase
 * @returns {Object|null}  { label, questions[] } ou null se não encontrado
 */
function getSanityCategoryByLabel(props, normalizedLabel) {
  var pId = props.getProperty('SANITY_PROJECT_ID');
  var ds  = props.getProperty('SANITY_DATASET');
  var tk  = props.getProperty('SANITY_READ_TOKEN');

  // lower() do GROQ garante comparação case-insensitive no lado do Sanity
  var groqQuery =
    '*[_type == "formCategory" && lower(label) == "' + normalizedLabel + '"][0]' +
    '{ label, questions[]{ "label": question, "id": fieldName.current } }';

  var url = 'https://' + pId + '.api.sanity.io/v2021-10-21/data/query/' + ds +
            '?query=' + encodeURIComponent(groqQuery);

  try {
    var response = UrlFetchApp.fetch(url, {
      headers: { "Authorization": "Bearer " + tk },
      muteHttpExceptions: true
    });
    var parsed = JSON.parse(response.getContentText());
    // [0] na query retorna o objeto direto ou null quando não encontrado
    return parsed.result || null;
  } catch (err) {
    console.error("Erro ao buscar Sanity:", err);
    return null;
  }
}

// ─── CABEÇALHOS ──────────────────────────────────────────────────────────────

/**
 * Lê os cabeçalhos existentes na planilha e mescla com os novos,
 * sem jamais remover uma coluna que já exista.
 *
 * Regras:
 *  - Colunas existentes mantêm sua posição original
 *  - Colunas novas (perguntas adicionadas no Sanity) são anexadas à direita
 *  - Colunas de perguntas removidas no Sanity são mantidas (preservam histórico)
 *
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {string[]} fixedHeaders
 * @param {string[]} newDynamicHeaders
 * @returns {string[]}  Lista final de cabeçalhos na ordem correta
 */
function mergHeaders(sheet, fixedHeaders, newDynamicHeaders) {
  var lastCol = sheet.getLastColumn();
  var existingHeaders = [];

  if (lastCol > 0) {
    existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
      return String(h).trim();
    });
  }

  // Parte com os cabeçalhos fixos garantidos nas primeiras posições
  var merged = fixedHeaders.slice();

  // Adiciona cabeçalhos existentes que não sejam fixos (dinâmicos já salvos)
  existingHeaders.forEach(function(h) {
    if (h && merged.indexOf(h) === -1) {
      merged.push(h);
    }
  });

  // Adiciona cabeçalhos novos que ainda não existem em lugar nenhum
  newDynamicHeaders.forEach(function(h) {
    if (h && merged.indexOf(h) === -1) {
      merged.push(h);
    }
  });

  // Persiste cabeçalhos na planilha (sem apagar linhas de dados)
  sheet.getRange(1, 1, 1, merged.length).setValues([merged])
       .setFontWeight("bold")
       .setBackground("#f8fafc");

  return merged;
}

// ─── MONTAGEM DA LINHA ───────────────────────────────────────────────────────

/**
 * Monta o array de valores na ordem exata dos cabeçalhos finais.
 * Colunas sem valor correspondente ficam vazias (não corrompem dados).
 *
 * Usa `fieldId in data` para detectar falsy values legítimos (0, false, "0").
 *
 * @param {string[]} finalHeaders
 * @param {string[]} fixedHeaders
 * @param {Array}    questions       Lista de { id, label } vinda do Sanity
 * @param {Object}   data            Payload recebido do formulário
 * @returns {Array}
 */
function buildRow(finalHeaders, fixedHeaders, questions, data) {
  // Índice rápido: label da pergunta → { id } para lookup O(1)
  var questionIndex = {};
  questions.forEach(function(q) {
    questionIndex[q.label] = q;
  });

  return finalHeaders.map(function(header) {
    var value;

    switch (header) {
      case "Data":     return new Date();
      case "Nome":     value = data.name    || ""; break;
      case "Email":    value = data.email   || ""; break;
      case "Telefone": value = data.phone   || ""; break;
      default:
        // Campo dinâmico: busca pelo id técnico primeiro, depois pelo label
        var qInfo = questionIndex[header];
        if (qInfo) {
          // Usa 'in' para não perder falsy values válidos (0, false, "0")
          if (qInfo.id && qInfo.id in data) {
            value = data[qInfo.id];
          } else if (qInfo.label in data) {
            value = data[qInfo.label];
          } else {
            value = "";
          }
        } else {
          // Coluna histórica sem pergunta ativa → deixa vazia
          value = "";
        }
    }

    return sanitizeCell(value);
  });
}

// ─── UTILITÁRIOS ─────────────────────────────────────────────────────────────

/**
 * Valida e normaliza o nome da categoria.
 * Permite apenas letras (incluindo acentuadas), números, espaços, hífens e underscores.
 * Isso previne injeção de GROQ quando o valor for interpolado na query do Sanity.
 *
 * @param {*} raw
 * @returns {string|null}  String normalizada ou null se inválida
 */
function normalizeCategory(raw) {
  if (!raw) return null;
  var str = String(raw).trim().toLowerCase();
  // Allowlist: letras latinas (incluindo acentos), números, espaço, hífen, underscore
  if (!/^[a-zA-ZÀ-ÿ0-9\s\-_]+$/.test(str)) return null;
  return str;
}

/**
 * Protege contra injeção de fórmulas do Google Sheets.
 * Aplica-se a TODOS os campos, incluindo nome, email e telefone.
 * Converte booleans e números para string segura antes de checar.
 *
 * @param {*} value
 * @returns {string|Date}
 */
function sanitizeCell(value) {
  if (value instanceof Date) return value;
  if (value === null || value === undefined) return "";

  var str = String(value);

  // Caracteres que o Sheets interpreta como início de fórmula
  var dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousChars.indexOf(str.charAt(0)) !== -1) {
    return "'" + str;
  }

  return str;
}

/**
 * Cria uma resposta JSON padronizada.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
