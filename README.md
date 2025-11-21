# API de Inscrição IFRO

API REST para gerenciamento de inscrições e usuários do Instituto Federal de Rondônia (IFRO).

## Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Express.js** - Framework web
- **MongoDB** com **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Zod** - Validação de dados
- **Swagger** - Documentação da API
- **Jest** - Testes

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd api-inscricao
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados (se necessário):

```bash
npm run seed
```

## Executando a Aplicação

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

### Testes

```bash
npm test
```

## Documentação da API

A documentação completa da API está disponível via Swagger UI em:

```
http://localhost:5011/api-docs
```

### Endpoints Principais

#### Autenticação

- `POST /login` - Realizar login
- `POST /logout` - Realizar logout

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

## Estrutura do Projeto

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

## Autenticação

A API utiliza autenticação baseada em JWT (JSON Web Tokens). Para acessar endpoints protegidos:

1. Faça login através do endpoint `POST /login`
2. Use o token retornado no header `Authorization`:
   ```
   Authorization: Bearer <seu-token-jwt>
   ```

### Papéis de Usuário

- **Administrador**: Acesso completo ao sistema
- **Coordenador**: Gerenciamento de usuários e inscrições
- **Avaliador**: Avaliação de inscrições

## Validação de Dados

A API utiliza Zod para validação de dados de entrada. Todos os campos obrigatórios são validados automaticamente.

## Tratamento de Erros

A API retorna erros padronizados com o seguinte formato:

```json
{
  "success": false,
  "message": "Mensagem de erro",
  "error": {
    "statusCode": 400,
    "errorType": "validationError",
    "field": "campo",
    "details": ["detalhes do erro"],
    "customMessage": "Mensagem personalizada"
  }
}
```

## Testes

Os testes são executados com Jest e Supertest. Para executar:

```bash
npm test
```

Para executar com cobertura:

```bash
npm run test:coverage
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
