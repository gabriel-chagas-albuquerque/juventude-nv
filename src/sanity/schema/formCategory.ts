import { defineType, defineField } from 'sanity';

export const formCategory = defineType({
  name: 'formCategory',
  type: 'document',
  title: 'Categoria de Formulário',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Título do Formulário (ex: Pedido de Oração)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      type: 'slug',
      title: 'Identificador (slug)',
      options: { source: 'label' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'questions',
      type: 'array',
      title: 'Perguntas deste Formulário',
      of: [
        {
          type: 'object',
          name: 'questionItem',
          title: 'Pergunta',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Pergunta/Label',
            }),
            defineField({
              name: 'fieldName',
              type: 'slug',
              title: 'ID do Campo (camelCase para o Google Sheets)',
              options: { 
                source: (_, options: any) => options.parent?.question || '' 
              },
            }),
            defineField({
              name: 'fieldType',
              type: 'string',
              title: 'Tipo e Validação',
              options: {
                list: [
                  { title: 'Texto Simples', value: 'text' },
                  { title: 'Texto Longo (Área)', value: 'textarea' },
                  { title: 'E-mail', value: 'email' },
                  { title: 'Telefone (Máscara)', value: 'tel' },
                  { title: 'Data', value: 'date' },
                  { title: 'Número', value: 'number' },
                  { title: 'CPF (Máscara)', value: 'cpf' },
                  { title: 'Checkbox (Sim/Não)', value: 'boolean' },
                  { title: 'Múltipla Escolha', value: 'select' },
                ],
              },
            }),
            defineField({
              name: 'options',
              type: 'array',
              title: 'Opções da Pergunta',
              description: 'Adicione as opções para perguntas de múltipla escolha',
              of: [{ type: 'string' }],
              hidden: ({ parent }) => parent?.fieldType !== 'select',
            }),
            defineField({
              name: 'allowMultiple',
              type: 'boolean',
              title: 'Permitir múltiplas respostas?',
              description: 'Se ativado, o usuário poderá selecionar mais de uma opção (Checkboxes). Se desativado, apenas uma (Radio).',
              initialValue: false,
              hidden: ({ parent }) => parent?.fieldType !== 'select',
            }),
            defineField({
              name: 'required',
              type: 'boolean',
              title: 'Obrigatório?',
              initialValue: false,
            }),
            defineField({
              name: 'placeholder',
              type: 'string',
              title: 'Texto de ajuda (Placeholder)',
            }),
          ],
          // Isso faz o item aparecer com o nome da pergunta no painel do Sanity
          preview: {
            select: { title: 'question', subtitle: 'fieldType' },
          },
        },
      ],
    }),
  ],
});