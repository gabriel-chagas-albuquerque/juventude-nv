import { defineType, defineField } from 'sanity';

export const formCategory = defineType({
  name: 'formCategory',
  type: 'document',
  title: 'Categoria de Formulário',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Rótulo (ex: Pedido de Oração)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      type: 'slug',
      title: 'Valor (slug interno)',
      options: {
        source: 'label',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Descrição da categoria',
    }),
    defineField({
      name: 'order',
      type: 'number',
      title: 'Ordem',
    }),
  ],
});
