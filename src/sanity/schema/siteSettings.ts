import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  type: 'document',
  title: 'Configurações do Site',
  groups: [
    { name: 'home', title: 'Home' },
    { name: 'about', title: 'Sobre Nós' },
    { name: 'enem', title: 'ENEM Cristão' },
  ],
  fields: [
    defineField({
      name: 'home',
      type: 'object',
      title: 'Página Inicial & Global',
      group: 'home',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Título do Site',
          description: 'O nome principal da organização (ex: Juventude NV)',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'slogan',
          type: 'string',
          title: 'Slogan / Descrição Curta',
          description: 'Aparece logo abaixo do título no topo do site',
        }),
        defineField({
          name: 'organizationName',
          type: 'string',
          title: 'Nome da Organização (Completo)',
          description: 'Ex: Assembleia de Deus Novo Viver',
        }),
        defineField({
          name: 'logo',
          type: 'image',
          title: 'Logo do Site',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'heroImage',
          type: 'image',
          title: 'Imagem de Fundo (Hero)',
          description: 'Imagem principal que aparece no topo da página inicial',
          options: {
            hotspot: true,
          },
        }),
        defineField({
          name: 'socialLinks',
          type: 'object',
          title: 'Redes Sociais',
          fields: [
            { name: 'instagram', type: 'url', title: 'Instagram' },
            { name: 'youtube', type: 'url', title: 'YouTube' },
            { name: 'whatsapp', type: 'url', title: 'WhatsApp (Link)' },
          ],
        }),
        defineField({
          name: 'contactInfo',
          type: 'object',
          title: 'Informações de Contato',
          fields: [
            { name: 'address', type: 'string', title: 'Endereço Principal' },
            { name: 'phone', type: 'string', title: 'Telefone de Contato' },
            { name: 'email', type: 'string', title: 'E-mail de Contato' },
          ],
        }),
        defineField({
          name: 'footerText',
          type: 'text',
          title: 'Texto do Rodapé',
          description: 'Breve descrição que aparece no final da página',
        }),
      ]
    }),
    defineField({
      name: 'aboutUs',
      type: 'object',
      title: 'Sobre Nós',
      group: 'about',
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
    }),
    defineField({
      name: 'enemCristao',
      type: 'object',
      title: 'ENEM Cristão',
      group: 'enem',
      fields: [
        defineField({
          name: 'badge',
          type: 'string',
          title: 'Selo de Destaque (Topo)',
          initialValue: 'Iniciativa Juventude NV',
        }),
        defineField({
          name: 'title',
          type: 'string',
          title: 'Título Principal (Hero)',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          type: 'string',
          title: 'Subtítulo (Hero)',
        }),
        defineField({
          name: 'description',
          type: 'array',
          title: 'Descrição / O que é?',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'features',
          type: 'array',
          title: 'Pilares / Funcionalidades',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Título' },
                { name: 'description', type: 'text', title: 'Descrição', rows: 3 },
                { 
                  name: 'icon', 
                  type: 'string', 
                  title: 'Ícone (Lucide Icon Name)',
                  description: 'Nomes sugeridos: BookOpen, GraduationCap, Trophy, Sparkles',
                },
              ],
            },
          ],
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
        defineField({
          name: 'ctaText',
          type: 'string',
          title: 'Texto de Chamada para Inscrição',
          description: 'Aparece no final da página (ex: Prepare-se para o maior desafio bíblico!)',
        }),
        defineField({
          name: 'ctaButtonText',
          type: 'string',
          title: 'Texto do Botão de Inscrição',
          initialValue: 'Inscreva-se Agora',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'home.title',
    },
    prepare({ title }) {
      return {
        title: title || 'Configurações do Site',
        subtitle: 'Gerencie o conteúdo global, Sobre Nós e ENEM Cristão',
      };
    },
  },
});
