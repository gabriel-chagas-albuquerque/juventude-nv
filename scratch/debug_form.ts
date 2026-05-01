
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '1mpxey5n',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2021-10-21',
});

async function debugFormStructure() {
  console.log('--- DEBUG DE ESTRUTURA DE FORMULÁRIO ---');
  
  const query = `*[_type == "formCategory"]{
    label,
    "identifier": value.current,
    questions[] {
      question,
      "id": fieldName.current,
      fieldType
    }
  }`;

  try {
    const categories = await client.fetch(query);
    
    if (categories.length === 0) {
      console.log('Nenhuma categoria encontrada no Sanity.');
      return;
    }

    categories.forEach((cat: any) => {
      console.log(`\n📂 CATEGORIA: "${cat.label}" (ID: ${cat.identifier})`);
      console.log('-------------------------------------------');
      
      const mockDynamicValues: any = {};
      
      cat.questions?.forEach((q: any) => {
        console.log(`   ❓ Pergunta: "${q.question}"`);
        console.log(`      ID Técnico (fieldName): "${q.id}"`);
        console.log(`      Tipo: ${q.fieldType}`);
        
        // Simular preenchimento
        mockDynamicValues[q.id] = `Resposta teste para ${q.id}`;
      });

      // Simular o Payload do Frontend (FormPage.tsx:103)
      const payload = {
        name: "João Silva",
        email: "joao@teste.com",
        phone: "(11) 99999-9999",
        category: cat.label,
        ...mockDynamicValues
      };

      console.log('\n🚀 PAYLOAD QUE O FRONTEND ENVIARIA PARA O GOOGLE:');
      console.log(JSON.stringify(payload, null, 2));
    });

  } catch (error) {
    console.error('Erro ao buscar dados do Sanity:', error);
  }
}

debugFormStructure();
