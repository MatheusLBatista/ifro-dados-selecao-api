# IFRO Dados Seleção

API para gerenciamento de inscrições do Instituto Federal de Rondônia.

## Tecnologias Utilizadas

- **TypeScript** e **Node.js**
- **Express** - Framework web
- **MongoDB** com **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de dados
- **Swagger** - Documentação da API
- **Jest** - Testes

## Executando a Aplicação

### Opção 1: Rodando com Docker (Recomendado)

#### Pré-requisitos

- Docker
- Docker Compose

#### Iniciar a aplicação

```bash
# Clone o repositório
git clone <https://gitlab.fslab.dev/matheus.lucas.batista/ifro-dados-selecao-api.git>

# Acesse o diretório do projeto
cd ifro-dados-selecao-api

# Construir e iniciar os containers
docker compose up --build -d
```

Link da API: `http://localhost:5011`.

#### Popular o banco de dados

```bash
docker compose exec app npm run seed
```

#### Executar testes no container

```bash
docker compose exec app npm run test
```

#### Parar os containers

```bash
docker compose down
```

#### Parar e remover volumes

```bash
docker compose down -v
```

### Opção 2: Rodando Localmente (sem Docker)

#### Pré-requisitos

- Node.js 18+
- MongoDB instalado e rodando localmente
- npm ou yarn

#### Configuração

```bash
# Clone o repositório
git clone <https://gitlab.fslab.dev/matheus.lucas.batista/ifro-dados-selecao-api.git>

# Acesse o diretório do projeto
cd ifro-dados-selecao-api

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env
# Edite o .env com suas configurações locais
```

#### Desenvolvimento

```bash
npm run dev
```

#### Popular o banco de dados

```bash
npm run seed
```

#### Executar testes

```bash
npm run test
```

---

## Documentação da API

A documentação swagger da API está disponível em:

```
http://localhost:5011/api-docs
```

### Endpoints

#### Autenticação

- `POST /login` - Realizar login
- `POST /logout` - Realizar logout (requer autenticação)

#### Usuários

- `POST /usuario` - Criar usuário (requer autenticação)
- `GET /usuario` - Listar usuários (requer autenticação)
- `GET /usuario/:id` - Obter usuário por ID (requer autenticação)
- `DELETE /usuario/:id` - Excluir usuário (requer autenticação)

#### Inscrições

- `POST /inscricao` - Criar inscrição
- `GET /inscricao` - Listar inscrições (requer autenticação)
- `GET /inscricao/:id` - Obter inscrição por ID (requer autenticação)
- `GET /inscricao/avaliadas` - Listar inscrições avaliadas (requer autenticação)
- `PATCH /inscricao/:id/avaliar` - Avaliar inscrição (requer autenticação)
- `PATCH /inscricao/:id/aprovar` - Aprovar inscrição (requer autenticação)

## Estrutura do projeto

```
src/
├── app.ts                 # Configuração principal da aplicação
├── server.ts              # Ponto de entrada do servidor
├── config/                # Configurações
│   └── DbConnect.ts       # Conexão com banco de dados
├── controller/            # Controladores da API
├── docs/                  # Documentação Swagger
│   ├── paths/            # Definições dos endpoints
│   ├── schemas/          # Definições dos schemas
│   └── utils/            # Utilitários da documentação
├── middlewares/          # Middlewares personalizados
├── models/               # Modelos do MongoDB
├── repository/           # Camada de acesso a dados
├── routes/               # Definição das rotas
├── service/              # Lógica de negócio
├── test/                 # Testes
└── utils/                # Utilitários diversos
```

### Papéis do usuário

- **Administrador**: Acesso completo ao sistema
- **Coordenador**: Listagem de usuários e inscrições e aprovação de inscrições
- **Avaliador**: Listagem e avaliação de inscrições
