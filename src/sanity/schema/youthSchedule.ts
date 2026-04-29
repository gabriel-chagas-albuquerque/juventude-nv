import { defineType, defineField } from 'sanity';

export const youthSchedule = defineType({
  name: 'youthSchedule',
  type: 'document',
  title: 'Programação',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Título do Evento',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      type: 'date',
      title: 'Data do Evento',
      description: 'Ex: 2026-05-15',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dayOfWeek',
      type: 'string',
      title: 'Dia da Semana',
      options: {
        list: [
          { title: 'Domingo', value: 'domingo' },
          { title: 'Segunda-feira', value: 'segunda' },
          { title: 'Terça-feira', value: 'terca' },
          { title: 'Quarta-feira', value: 'quarta' },
          { title: 'Quinta-feira', value: 'quinta' },
          { title: 'Sexta-feira', value: 'sexta' },
          { title: 'Sábado', value: 'sabado' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'time',
      type: 'string',
      title: 'Horário',
      placeholder: 'Ex: 19:30',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      title: 'Local (Nome)',
      placeholder: 'Ex: Templo Central',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      type: 'string',
      title: 'Endereço Completo',
      placeholder: 'Ex: Rua Exemplo, 123 - Centro',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Descrição',
    }),
  ],
});
