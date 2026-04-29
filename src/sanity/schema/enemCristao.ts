import { defineType, defineField } from 'sanity';

export const enemCristao = defineType({
  name: 'enemCristao',
  type: 'document',
  title: 'ENEM Cristão',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Título',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtítulo',
    }),
    defineField({
      name: 'description',
      type: 'array',
      title: 'Descrição',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'eventDate',
      type: 'date',
      title: 'Data do Evento',
    }),
    defineField({
      name: 'prizes',
      type: 'array',
      title: 'Premiações',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'position', type: 'string', title: 'Posição (ex: 1º Lugar)' },
            { name: 'prize', type: 'string', title: 'Prêmio' },
          ],
        },
      ],
    }),
    defineField({
      name: 'editalFile',
      type: 'file',
      title: 'Arquivo do Edital (PDF)',
    }),
  ],
});
