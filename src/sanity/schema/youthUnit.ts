import { defineType, defineField } from 'sanity';

export const youthUnit = defineType({
  name: 'youthUnit',
  type: 'document',
  title: 'Unidade',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Nome da Unidade',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      type: 'string',
      title: 'Endereço',
    }),
    defineField({
      name: 'leader',
      type: 'string',
      title: 'Líder / Pastor',
    }),
    defineField({
      name: 'cultDays',
      type: 'array',
      title: 'Dias de Culto',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', type: 'string', title: 'Dia da Semana' },
            { name: 'time', type: 'string', title: 'Horário' },
          ],
        },
      ],
    }),
    defineField({
      name: 'whatsappLink',
      type: 'url',
      title: 'Link do WhatsApp',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Imagem da Unidade',
      options: {
        hotspot: true,
      },
    }),
  ],
});
