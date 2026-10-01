# API de Usuários — Path Params e Query Params

**Aluno:** João Pedro Oliveira Jalles  
**Disciplina:** Arquitetura de Aplicações Web

Solução dos exercícios da Aula 2 (API REST com Express): filtros com *query params* no `GET`, cadastro com `POST`, alteração com `PUT` usando *path param*, e as requisições montadas no Thunder Client. Todas as respostas abaixo foram obtidas executando o servidor deste repositório.

## Como executar

Requisitos: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm start        # servidor em http://localhost:3000
```

Para reiniciar automaticamente ao salvar o código, use `npm run dev`.

Os dados ficam **em memória**: cadastros e alterações somem quando o servidor é reiniciado. As respostas abaixo foram geradas na ordem em que aparecem (GET, depois POST, depois PUT), a partir do array original.

## Como montar as requisições no Thunder Client

1. Instale a extensão **Thunder Client** no VS Code e abra pelo ícone de raio na barra lateral.
2. Clique em **New Request**.
3. Escolha o método (GET, POST ou PUT) e digite a URL. Os *query params* também podem ser preenchidos na aba **Query**.
4. No `PUT`, abra a aba **Body**, escolha **JSON** e informe os novos dados.
5. Clique em **Send** e confira o status e a resposta.

## Rotas da API

| Método | Rota | Tipo de parâmetro | Descrição |
|---|---|---|---|
| GET | `/usuarios` | query: `cidade`, `ativo`, `limite` | Lista usuários, com filtros opcionais |
| GET | `/usuarios/:id` | path: `id` | Busca um usuário específico |
| POST | `/usuarios` | query: `nome` (obrigatório), `cidade` | Cadastra um usuário |
| PUT | `/usuarios/:id` | path: `id` + body JSON | Altera `nome`, `cidade` e/ou `ativo` |

**Path param x query param:** o path param (`/usuarios/2`) identifica *qual* recurso será acessado; os query params (`?cidade=SP&ativo=true`) refinam *como* a consulta é feita (filtro, limite, etc.).

---

## Exercícios — GET (query params)

Array de usuários usado nos exercícios: veja `server.js`.

#### Exercício 1. Filtrando apenas por status

> A auditoria precisa de todos os usuários **inativos**, independente da cidade.

- **Método:** `GET`
- **URL:** `http://localhost:3000/usuarios?ativo=false`
- **Status:** `200 OK`
- **Resposta:**

```json
[
  {
    "id": 2,
    "nome": "Mariana Costa",
    "cidade": "RJ",
    "ativo": false,
    "cargo": "Designer UI/UX"
  },
  {
    "id": 5,
    "nome": "Felipe Ramos",
    "cidade": "SP",
    "ativo": false,
    "cargo": "QA Engineer"
  },
  {
    "id": 8,
    "nome": "Patrícia Rocha",
    "cidade": "BH",
    "ativo": false,
    "cargo": "Analista de Dados"
  },
  {
    "id": 10,
    "nome": "Letícia Pires",
    "cidade": "SP",
    "ativo": false,
    "cargo": "Scrum Master"
  }
]
```

Query param: `ativo=false`.

#### Exercício 2. Colaboradores do RJ e ativos

> Localizar quem mora no Rio de Janeiro (RJ) e está ativo.

- **Método:** `GET`
- **URL:** `http://localhost:3000/usuarios?cidade=RJ&ativo=true`
- **Status:** `200 OK`
- **Resposta:**

```json
[
  {
    "id": 7,
    "nome": "Bruno Martins",
    "cidade": "RJ",
    "ativo": true,
    "cargo": "Tech Lead"
  }
]
```

Query params combinados com `&`: `cidade=RJ` e `ativo=true`.

#### Exercício 3. Dois primeiros ativos de São Paulo

> Exibir apenas os 2 primeiros usuários ativos de SP.

- **Método:** `GET`
- **URL:** `http://localhost:3000/usuarios?cidade=SP&ativo=true&limite=2`
- **Status:** `200 OK`
- **Resposta:**

```json
[
  {
    "id": 1,
    "nome": "Lucas Silva",
    "cidade": "SP",
    "ativo": true,
    "cargo": "Dev Frontend"
  },
  {
    "id": 3,
    "nome": "Rodrigo Lima",
    "cidade": "SP",
    "ativo": true,
    "cargo": "Dev Backend"
  }
]
```

`limite=2` corta a lista depois dos filtros. São Paulo tem 3 usuários ativos (Lucas, Rodrigo e Gustavo); aparecem só os 2 primeiros.

#### Exercício 4. Curitiba e inativos

> Usuários de Curitiba que estejam inativos.

- **Método:** `GET`
- **URL:** `http://localhost:3000/usuarios?cidade=CURITIBA&ativo=false`
- **Status:** `404 Not Found`
- **Resposta:**

```json
{
  "mensagem": "Nenhum usuário encontrado"
}
```

Nenhum registro atende: a única usuária de Curitiba (Camila Duarte) está ativa, então a API responde 404 com mensagem.

#### Exercício 5. Inativos de SP, limitado a 2

> Inativos, em São Paulo, limitando a 2 registros.

- **Método:** `GET`
- **URL:** `http://localhost:3000/usuarios?ativo=false&cidade=SP&limite=2`
- **Status:** `200 OK`
- **Resposta:**

```json
[
  {
    "id": 5,
    "nome": "Felipe Ramos",
    "cidade": "SP",
    "ativo": false,
    "cargo": "QA Engineer"
  },
  {
    "id": 10,
    "nome": "Letícia Pires",
    "cidade": "SP",
    "ativo": false,
    "cargo": "Scrum Master"
  }
]
```

Três filtros juntos. Os inativos de SP são Felipe e Letícia, que são exatamente 2.

#### Exercício 6. Belo Horizonte e inativos, sem limite

> Usuários de BH com conta inativa, sem limite.

- **Método:** `GET`
- **URL:** `http://localhost:3000/usuarios?cidade=BH&ativo=false`
- **Status:** `200 OK`
- **Resposta:**

```json
[
  {
    "id": 8,
    "nome": "Patrícia Rocha",
    "cidade": "BH",
    "ativo": false,
    "cargo": "Analista de Dados"
  }
]
```

Sem `limite`, todos os que atendem aos filtros são retornados.

---

## Exercícios — POST

#### Exercício 1. Cadastrar Fernanda Lima

> Cadastrar a colaboradora "Fernanda Lima", residente em "Belo Horizonte".

- **Método:** `POST`
- **URL:** `http://localhost:3000/usuarios?nome=Fernanda%20Lima&cidade=Belo%20Horizonte`
- **Status:** `201 Created`
- **Resposta:**

```json
{
  "id": 11,
  "nome": "Fernanda Lima",
  "cidade": "BELO HORIZONTE",
  "ativo": true
}
```

No Thunder Client, use a aba **Query** com `nome = Fernanda Lima` e `cidade = Belo Horizonte` (os espaços são codificados como `%20` automaticamente). A cidade é gravada em maiúsculas.

#### Exercício 2. Cadastrar Roberto Justus sem cidade

> Cadastrar "Roberto Justus" sem informar a cidade.

- **Método:** `POST`
- **URL:** `http://localhost:3000/usuarios?nome=Roberto%20Justus`
- **Status:** `201 Created`
- **Resposta:**

```json
{
  "id": 12,
  "nome": "Roberto Justus",
  "cidade": "nao informado",
  "ativo": true
}
```

Sem `cidade`, a API grava `"nao informado"`.

#### Exercício 3. Validação: sem o campo nome

> Enviar apenas a cidade "Salvador", sem o nome, para testar a validação.

- **Método:** `POST`
- **URL:** `http://localhost:3000/usuarios?cidade=Salvador`
- **Status:** `400 Bad Request`
- **Resposta:**

```json
{
  "erro": "O nome é obrigatório"
}
```

Como `nome` é obrigatório, a API responde 400 e nada é cadastrado.

---

## Exercícios — PUT

#### Exercício 1. Alterar nome da usuária ID 2

> Alterar o nome da usuária de ID 2 para "MARIA SILVA", mantendo cidade e status.

- **Método:** `PUT`
- **URL:** `http://localhost:3000/usuarios/2`
- **Body (JSON):**

```json
{
  "nome": "MARIA SILVA"
}
```

- **Status:** `200 OK`
- **Resposta:**

```json
{
  "id": 2,
  "nome": "MARIA SILVA",
  "cidade": "RJ",
  "ativo": false,
  "cargo": "Designer UI/UX"
}
```

O `id` vai no caminho (path param) e o novo dado vai em **Body > JSON**. Como só `nome` foi enviado, `cidade` e `ativo` permanecem iguais.

#### Exercício 2. Suspender o acesso do colaborador ID 1

> O colaborador de ID 1 foi transferido para o Rio de Janeiro e terá o acesso suspenso temporariamente (`ativo: false`).

- **Método:** `PUT`
- **URL:** `http://localhost:3000/usuarios/1`
- **Body (JSON):**

```json
{
  "cidade": "RJ",
  "ativo": false
}
```

- **Status:** `200 OK`
- **Resposta:**

```json
{
  "id": 1,
  "nome": "Lucas Silva",
  "cidade": "RJ",
  "ativo": false,
  "cargo": "Dev Frontend"
}
```

Além de suspender o acesso (`ativo: false`), o body atualiza a cidade para RJ, refletindo a transferência. Se quiser apenas a suspensão, envie somente `{ "ativo": false }`.

#### Exercício 3. Alterar usuário inexistente (ID 50)

> Tentar alterar o nome para "CARLOS EDUARDO" do usuário de ID 50.

- **Método:** `PUT`
- **URL:** `http://localhost:3000/usuarios/50`
- **Body (JSON):**

```json
{
  "nome": "CARLOS EDUARDO"
}
```

- **Status:** `404 Not Found`
- **Resposta:**

```json
{
  "mensagem": "Usuário não encontrado"
}
```

O ID 50 não existe no array, então a API responde 404.

---

## Observações

- O `POST` recebe os dados pela **query string**, seguindo o exemplo da aula. Em uma API de produção, o mais comum é enviar esses dados no corpo (body) da requisição.
- Novos usuários são criados com `ativo: true`, para que apareçam nos filtros de status do `GET`.
- O cadastro e a alteração gravam a cidade em maiúsculas, o que permite buscar por `?cidade=` sem diferenciar maiúsculas de minúsculas.

## Estrutura do repositório

```
api-usuarios/
├── server.js        # API Express (GET, POST e PUT)
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```
