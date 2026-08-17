# ACIST-SL — Frontend

Frontend do sistema de cadastro de associados da ACIST São Leopoldo.

Feito em React + TypeScript + Vite.

> Este projeto é **parametrizável**: a mesma base de código atende tanto a versão real usada pela ACIST São Leopoldo quanto a versão de apresentação/demonstração para a Unisinos, alternando apenas as variáveis de ambiente (veja "As duas versões do sistema" abaixo) — não é preciso mexer no código para trocar entre elas.

**Deploy em produção:** https://acist-sl-frontend.vercel.app

## Como rodar o projeto localmente

```bash
git clone <URL_DO_REPOSITORIO>
cd acist-sl-frontend
npm install
cp .env.example .env
npm run dev
```

Requisitos: Node.js 18 ou superior.

Edita o `.env` antes de rodar (veja abaixo o que cada variável faz). Por padrão, `npm run dev` sobe o projeto em `http://localhost:5173`.

## Variáveis do .env

```dotenv
# URL do backend
VITE_API_URL=http://localhost:3000

# Ativa a área do associado (login com email/senha)
VITE_ASSOCIATE_AREA=true

# Mostra o campo de senha na tela inicial
VITE_HOME_PASSWORD=true

# Mostra o campo de senha na etapa de cadastro da empresa
VITE_CADASTRO_EMPRESA_PASSWORD=true
```

Para rodar local apontando pro backend já publicado (em vez de rodar o backend localmente também):

```dotenv
VITE_API_URL=https://acist-sl-backend.onrender.com/api
```

⚠️ Atenção: para desligar uma feature, é preciso escrever `false` explicitamente (ex: `VITE_HOME_PASSWORD=false`). Se você só apagar a linha do `.env`, ela continua ativada por padrão.

## As duas versões do sistema

O projeto atende dois modelos de negócio diferentes, só trocando o `.env` — não precisa mexer no código.

**Com login do associado** (versão real, usada pela ACIST):

```dotenv
VITE_ASSOCIATE_AREA=true
VITE_HOME_PASSWORD=true
VITE_CADASTRO_EMPRESA_PASSWORD=true
```

**Sem login** (acesso por link com token enviado por e-mail — versão de apresentação/demonstração para a Unisinos):

```dotenv
VITE_ASSOCIATE_AREA=false
VITE_HOME_PASSWORD=false
VITE_CADASTRO_EMPRESA_PASSWORD=false
```

⚠️ Essas flags precisam bater com a configuração do backend — se um lado achar que tem login e o outro não, o cadastro quebra.

A área do colaborador (admin/aprovador) é igual nas duas versões e não muda com essas flags.

## Estrutura básica


```
src/
├── app/
│   ├── pages/          # Todas as telas
│   └── routes/         # Rotas da aplicação
├── components/         # Componentes reutilizáveis (Header, Footer...)
├── config/
│   └── features.ts     # Lê as flags do .env
└── services/
    └── api.ts          # Configuração do Axios (envia o token automaticamente)
```

## Login e permissões

### Colaborador (admin/aprovador)

- Loga com email/senha e recebe um token, salvo no navegador.
- Existem dois perfis: Administrador e Aprovador. Só o Administrador pode criar/editar outros colaboradores. Só o Aprovador pode aprovar cadastros, documentos e pagamentos.
- As rotas da área interna (`/admin/...`) são protegidas — só abrem pra quem estiver logado com o perfil certo.
- Esse fluxo é **igual nas duas versões** do sistema e não muda com as flags.

### Associado

O acesso do associado muda conforme a versão configurada:

- **Versão com login (ACIST)**: o associado cria uma senha durante o cadastro (Home/Etapa 1) e pode logar depois na Área do Associado com email e senha.
- **Versão sem login (Unisinos)**: o associado não cria senha. Ele recebe por e-mail um link com token (válido por 7 dias) que dá acesso direto para continuar ou editar o cadastro, sem precisar fazer login.

Nas duas versões, o associado recebe e-mails automáticos em pontos-chave do processo (ex: ao clicar em "Já fiz o pagamento" e quando o cadastro é aprovado).

## Build para produção

```bash
npm run build
```

Gera os arquivos prontos na pasta `dist/`.

## Deploy (Vercel)

Este projeto está publicado na Vercel: **https://acist-sl-frontend.vercel.app**

Passo a passo pra atualizar o deploy:

1. Configura as variáveis de ambiente no painel da Vercel → **Settings → Environment Variables**:
```dotenv
   VITE_API_URL=https://acist-sl-backend.onrender.com/api
   VITE_ASSOCIATE_AREA=true
   VITE_HOME_PASSWORD=true
   VITE_CADASTRO_EMPRESA_PASSWORD=true
```
   (ajusta os valores conforme a versão desejada — ACIST ou apresentação Unisinos)

2. As variáveis são aplicadas **no momento do build** — mudar uma variável não atualiza sozinho o site já publicado. É preciso gerar um novo deploy depois de salvar:
   - Automático: um `git push` no branch conectado à Vercel (geralmente `main`) dispara um novo build sozinho
   - Manual: painel da Vercel → aba **Deployments** → menu "⋯" do último deploy → **Redeploy**

3. Confirma que o backend libera CORS pra `https://acist-sl-frontend.vercel.app` (senão as requisições da Vercel são bloqueadas mesmo com tudo certo no front)

4. Depois do deploy terminar (status **Ready**), testa o fluxo completo: cadastro → pagamento → e-mail → aprovação, direto na URL de produção
