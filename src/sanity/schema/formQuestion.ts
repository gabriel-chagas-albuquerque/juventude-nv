import { defineType, defineField } from 'sanity';

export const formQuestion = defineType({
  name: 'formQuestion',
  type: 'document',
  title: 'Pergunta de Formulário',
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      title: 'Pergunta',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fieldName',
      type: 'slug',
      title: 'Nome do campo (camelCase)',
      options: {
        source: 'question',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fieldType',
      type: 'string',
      title: 'Tipo de campo',
      options: {
        list: [
          { title: 'Texto curto', value: 'text' },
          { title: 'Texto longo', value: 'textarea' },
          { title: 'Email', value: 'email' },
          { title: 'Telefone', value: 'tel' },
        ],
      },
    }),
    defineField({
      name: 'placeholder',
      type: 'string',
      title: 'Placeholder',
    }),
    defineField({
      name: 'required',
      type: 'boolean',
      title: 'Campo obrigatório?',
    }),
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Categorias',
      description: 'Selecione em quais formulários esta pergunta deve aparecer',
      of: [{ type: 'reference', to: [{ type: 'formCategory' }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Ordem',
    }),
  ],
});
