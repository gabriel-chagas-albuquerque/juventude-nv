# Juventude NV 🚀

O **Juventude NV** é uma plataforma web moderna desenvolvida para a organização de jovens da Assembleia de Deus Novo Viver. O projeto centraliza a programação semanal, eventos especiais, formulários de contato dinâmicos e a iniciativa **ENEM Cristão**, tudo gerenciado de forma intuitiva através do Sanity CMS.

## ✨ Funcionalidades

-   🏠 **Home Dinâmica**: Informações da organização, redes sociais e textos globais gerenciados via CMS.
-   📅 **Programação & Eventos**: Sistema completo de cronograma com suporte a eventos semanais, mensais (dia fixo ou ordinal) e eventos únicos.
-   📖 **ENEM Cristão**: Página dedicada para a iniciativa de estudo bíblico, com download de edital e informações de premiação.
-   📝 **Formulários Inteligentes**: Sistema de formulários dinâmicos que adapta campos com base em categorias definidas no Sanity.
-   🎨 **Design Premium**: Interface moderna com animações suaves (Framer Motion) e componentes Shadcn UI.
-   ⚙️ **CMS Centralizado**: Configurações globais do site e conteúdo institucional gerenciados em um único lugar.

## 🛠️ Tecnologias

-   **Frontend**: [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
-   **Estilização**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (ícones)
-   **Animações**: [Framer Motion](https://www.framer.com/motion/)
-   **Gerenciamento de Conteúdo**: [Sanity CMS](https://www.sanity.io/)
-   **Formulários**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
-   **Roteamento**: [React Router 7](https://reactrouter.com/)

## 🚀 Começando

### Pré-requisitos

-   Node.js (versão 18 ou superior)
-   Gerenciador de pacotes (NPM ou PNPM)

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/gabriel-chagas-albuquerque/juventude-nv.git
    cd juventude-nv
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Preencha os valores com as credenciais do seu projeto Sanity e integrações.

4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## 🏗️ Estrutura do Projeto

```text
src/
├── components/     # Componentes de UI reaproveitáveis (Shadcn)
├── lib/            # Configurações de clientes (Sanity, Queries, Tipagem)
├── pages/          # Páginas principais da aplicação
├── sanity/         # Esquemas e configurações do Sanity Studio
└── App.tsx         # Roteamento e estrutura global
```

## ☁️ Configuração do Sanity

O projeto utiliza o **Sanity Studio** integrado. Para gerenciar os esquemas localmente ou via CLI:

-   A configuração do Studio está em `sanity.config.ts`.
-   Os esquemas de dados estão em `src/sanity/schema/`.

Para implantar mudanças no esquema:
```bash
npx sanity deploy
```

Desenvolvido com ❤️ pela equipe Juventude NV.
