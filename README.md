# Grupo Cred Consultoria — API

API RESTful desenvolvida em **Node.js + TypeScript** com **Express**, **Prisma ORM** e banco de dados **MariaDB**. Autenticação via **JWT** e containerização com **Docker**.

---

## Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM
- MariaDB 11
- Docker & Docker Compose
- JWT (jsonwebtoken)
- Argon2 (hash de senhas)
- Zod (validação)

---

## Instalação e configuração

### 1. Clone o repositório

```bash
git clone https://github.com/Ferreouz/grupo-cred-consultoria.git
cd grupo-cred-consultoria
```

## Execução com Docker

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### Subir todos os serviços (banco + API)

```bash
docker compose up --build
```

Isso irá:
1. Iniciar o container do **MariaDB** e aguardar ele ficar saudável
2. Buildar e iniciar o container do **backend** na porta `8081`

### Verificar se está rodando

```bash
docker compose ps
```

### Parar os serviços

```bash
docker compose down
```

---

## Execução com npm

### Pré-requisitos

- Acesso a uma instância MariaDB/MySQL
- Node & npm instalados

### Configure as variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores conforme necessário:

```bash
cp .env.example .env
```

O `.env.example` contém as seguintes variáveis:

```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/appdb"
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173,http://localhost:8080
PORT=8080
JWT_SECRET=supersecretkey
```

> ⚠️ **Atenção:** Em produção, substitua `JWT_SECRET` por um valor seguro e único.

---

### Instale as dependências e execute

```bash
npm i && npm run build && npm run start
```

---

## Uso da API

A API estará disponível em:

```
http://localhost:8081
```

### Autenticação

O endpoint de criar pedido requer autenticação via **Bearer Token**. Após fazer login, inclua o token no header das requisições:

```
Authorization: Bearer <seu_token_jwt>
```

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/login` | Login e geração de token JWT |

> Consulte a documentação completa do Postman para ver todos os endpoints disponíveis com exemplos de request/response.

---

## Documentação da API (Postman)

🔗 **[Acessar documentação no Postman](https://www.postman.com/SEU-LINK-AQUI)**

---

## Estrutura do projeto

```
grupo-cred-consultoria/
├── prisma/              # Schema e migrações do banco de dados
├── src/                 # Código-fonte da aplicação
├── .env.example         # Exemplo de variáveis de ambiente
├── Dockerfile           # Configuração do container da API
├── docker-compose.yml   # Orquestração dos serviços
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## Licença

MIT