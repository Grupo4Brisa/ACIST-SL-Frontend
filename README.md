# ACIST-SL — Frontend

Frontend do sistema de cadastro de associados da ACIST São Leopoldo.

Feito em **React + TypeScript + Vite**.

---

## Como rodar o projeto

```bash
npm install
cp .env.example .env
npm run dev
```

Edita o `.env` antes de rodar (veja abaixo o que cada variável faz).

---

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

⚠️ **Atenção**: para desligar uma feature, é preciso escrever `false` explicitamente (ex: `VITE_HOME_PASSWORD=false`). Se você só apagar a linha do `.env`, ela continua ativada por padrão.

---

## As duas versões do sistema

O projeto atende dois modelos de negócio diferentes, só trocando o `.env` — não precisa mexer no código.

**Com login do associado:**
```dotenv
VITE_ASSOCIATE_AREA=true
VITE_HOME_PASSWORD=true
VITE_CADASTRO_EMPRESA_PASSWORD=true
```

**Sem login (acesso por link com token enviado por e-mail):**
```dotenv
VITE_ASSOCIATE_AREA=false
VITE_HOME_PASSWORD=false
VITE_CADASTRO_EMPRESA_PASSWORD=false
```

⚠️ Essas flags precisam bater com a configuração do **backend** — se um lado achar que tem login e o outro não, o cadastro quebra.

A área do **colaborador** (admin/aprovador) é igual nas duas versões e não muda com essas flags.

---

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

---

## Login e permissões

- Colaborador loga com email/senha e recebe um token, salvo no navegador.
- Existem dois perfis: **Administrador** e **Aprovador**. Só o Administrador pode criar/editar outros colaboradores. Só o Aprovador pode aprovar cadastros, documentos e pagamentos.
- As rotas da área interna (`/admin/...`) são protegidas — só abrem pra quem estiver logado com o perfil certo.

---

## Build para produção

```bash
npm run build
```

Gera os arquivos prontos na pasta `dist/`.

---

## Deploy

- Configura as variáveis de ambiente (`.env`) direto no painel do serviço de hospedagem (Vercel, Railway, etc.) — elas são aplicadas no momento do build, então qualquer mudança exige gerar um novo build.
- `VITE_API_URL` precisa apontar pra URL pública do backend já publicado.
- Confirma que o backend libera CORS pra URL onde o front está hospedado.