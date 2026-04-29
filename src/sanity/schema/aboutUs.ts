import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutUs',
  type: 'document',
  title: 'Sobre Nós',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Título Principal',
      initialValue: 'Sobre Nós',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Descrição Geral',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'values',
      type: 'array',
      title: 'Valores/Pilares',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Título' },
            { name: 'description', type: 'text', title: 'Descrição', rows: 3 },
            { 
              name: 'icon', 
              type: 'string', 
              title: 'Ícone',
              options: {
                list: [
                  { title: 'Usuários/Comunhão', value: 'Users' },
                  { title: 'Alvo/Propósito', value: 'Target' },
                  { title: 'Coração/Adoração', value: 'Heart' },
                  { title: 'Estrela/Destaque', value: 'Star' },
                  { title: 'Fogo/Espírito', value: 'Flame' },
                  { title: 'Bíblia/Palavra', value: 'BookOpen' },
                ]
              }
            }
          ]
        }
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
});
