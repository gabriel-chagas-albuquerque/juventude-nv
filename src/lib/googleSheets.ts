/**
 * Função para enviar dados do formulário para o Google Sheets via Google Apps Script
 * @param data Os dados do formulário (incluindo campos gerais e dinâmicos)
 */
export async function sendToGoogleSheets(data: any) {
  // Substitua pela URL do seu Google Apps Script implantado como Web App
  const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

  if (!SCRIPT_URL) {
    console.warn('URL do Google Apps Script não configurada no .env');
    return { success: false, message: 'Configuração ausente' };
  }

  try {
    // Usamos text/plain para evitar problemas de CORS/Pre-flight com o Google Apps Script
    // O Script receberá isso e fará o JSON.parse normalmente
    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      token: import.meta.env.VITE_FORM_TOKEN as string
    };

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload),
    });

    // Como usamos no-cors, o fetch sempre "falha" em ler a resposta (opaque response),
    // mas o dado chega ao Google. Por isso, assumimos sucesso se não houver erro de rede.
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar para Google Sheets:', error);
    return { success: false, error };
  }
}
