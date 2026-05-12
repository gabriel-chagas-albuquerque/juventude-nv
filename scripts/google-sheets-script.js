/**
 * Google Apps Script para integração com o formulário Juventude NV.
 * Este script recebe os dados via POST do frontend e os salva em uma planilha do Google.
 * 
 * Instruções de instalação:
 * 1. Abra sua planilha do Google.
 * 2. Vá em Extensões > Apps Script.
 * 3. Cole este código no editor.
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Tipo: "App da Web".
 * 6. Configurações: "Executar como: Eu" e "Quem tem acesso: Qualquer um".
 * 7. Copie a URL gerada e coloque no seu arquivo .env como VITE_GOOGLE_SCRIPT_URL.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Nome da aba baseado na categoria (ex: 'Oração', 'Inscrição')
    var sheetName = data.category || "Geral";
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    
    // Se a aba não existir, cria uma nova
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Opcional: Estilizar cabeçalho na criação
    }
    
    // Pega o cabeçalho existente ou inicializa se estiver vazio
    var lastCol = sheet.getLastColumn();
    var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    
    // Chaves recebidas no payload
    var keys = Object.keys(data);
    
    // Verifica se há chaves novas que não estão no cabeçalho
    var headersChanged = false;
    keys.forEach(function(key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        headersChanged = true;
      }
    });
    
    // Se o cabeçalho mudou (novas colunas), atualiza a primeira linha
    if (headersChanged) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      // Estilização básica: Negrito e fundo cinza
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    // Monta a nova linha respeitando a ordem das colunas
    var newRow = headers.map(function(header) {
      var value = data[header];
      // Se for um objeto ou array (embora o frontend já trate), converte para string
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return value !== undefined ? value : "";
    });
    
    // Adiciona a linha na planilha
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({ "success": true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "success": false, "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
