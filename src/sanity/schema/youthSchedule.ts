import { defineType, defineField } from 'sanity';

export const youthSchedule = defineType({
  name: 'evento',
  title: 'Programação/Eventos',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título do Evento',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tipoRecorrencia',
      title: 'Tipo de Recorrência',
      type: 'string',
      options: {
        list: [
          { title: 'Semanal', value: 'semanal' },
          { title: 'Mensal (Dia Fixo)', value: 'mensal_dia' },
          { title: 'Mensal (Ordinal - ex: 3º Sábado)', value: 'mensal_ordinal' },
          { title: 'Evento Único', value: 'unico' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    // Campo visível apenas se for Semanal (ex: Todo Domingo)
    defineField({
      name: 'diaDaSemana',
      title: 'Dia da Semana',
      type: 'string',
      hidden: ({ document }) => 
        document?.tipoRecorrencia !== 'semanal' && document?.tipoRecorrencia !== 'mensal_ordinal',
      options: {
        list: [
          { title: 'Domingo', value: '0' },
          { title: 'Segunda', value: '1' },
          { title: 'Terça', value: '2' },
          { title: 'Quarta', value: '3' },
          { title: 'Quinta', value: '4' },
          { title: 'Sexta', value: '5' },
          { title: 'Sábado', value: '6' },
        ],
      },
    }),
    // Campo para o "3º Sábado", "1ª Segunda", etc.
    defineField({
      name: 'ordemMensal',
      title: 'Qual ocorrência no mês?',
      type: 'string',
      hidden: ({ document }) => document?.tipoRecorrencia !== 'mensal_ordinal',
      options: {
        list: [
          { title: '1º', value: '1' },
          { title: '2º', value: '2' },
          { title: '3º', value: '3' },
          { title: '4º', value: '4' },
          { title: 'Último', value: 'last' },
        ],
      },
    }),
    // Campo para data de evento único ou dia fixo mensal
    defineField({
      name: 'dataFixa',
      title: 'Data Específica ou Dia do Mês',
      type: 'date',
      hidden: ({ document }) => 
        document?.tipoRecorrencia !== 'unico' && document?.tipoRecorrencia !== 'mensal_dia',
      description: 'Para evento único (data completa) ou mensal dia fixo (apenas o dia será considerado).',
    }),
    defineField({
      name: 'horario',
      title: 'Horário',
      type: 'string',
      description: 'Ex: 19:30',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição/Líder',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      subtitle: 'horario',
    },
  },
});
