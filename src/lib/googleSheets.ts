/**
 * Função para enviar dados do formulário para o Google Sheets via Google Apps Script
 * @param data Os dados do formulário (incluindo campos gerais e dinâmicos)
 */
export async function sendToGoogleSheets(data: any) {
  // Substitua pela URL do seu Google Apps Script implantado como Web App
  const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

  if (!SCRIPT_URL) {
    return { success: false, message: 'Configuração ausente' };
  }

  try {
    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      token: import.meta.env.VITE_FORM_TOKEN as string
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', 
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && !result.error) {
      return { success: true, data: result };
    } else {
      return { 
        success: false, 
        message: 'Não foi possível completar o envio.', 
        code: result.code || response.status 
      };
    }
  } catch (error) {
    return { success: false, message: 'Não foi possível completar o envio.' };
  }
}
