import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  type: 'document',
  title: 'Configurações do Site',
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
  ],
});
