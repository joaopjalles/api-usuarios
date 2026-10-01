const express = require("express");
const app = express();
const PORT = 3000;

// Permite receber dados em JSON
app.use(express.json());

// ---------------------------------------------------------------
// Dados no servidor (em memória: reiniciar o servidor restaura o array)
// ---------------------------------------------------------------
const usuarios = [
  { id: 1, nome: "Lucas Silva", cidade: "SP", ativo: true, cargo: "Dev Frontend" },
  { id: 2, nome: "Mariana Costa", cidade: "RJ", ativo: false, cargo: "Designer UI/UX" },
  { id: 3, nome: "Rodrigo Lima", cidade: "SP", ativo: true, cargo: "Dev Backend" },
  { id: 4, nome: "Aline Souza", cidade: "BH", ativo: true, cargo: "Product Manager" },
  { id: 5, nome: "Felipe Ramos", cidade: "SP", ativo: false, cargo: "QA Engineer" },
  { id: 6, nome: "Camila Duarte", cidade: "CURITIBA", ativo: true, cargo: "DevOps" },
  { id: 7, nome: "Bruno Martins", cidade: "RJ", ativo: true, cargo: "Tech Lead" },
  { id: 8, nome: "Patrícia Rocha", cidade: "BH", ativo: false, cargo: "Analista de Dados" },
  { id: 9, nome: "Gustavo Neves", cidade: "SP", ativo: true, cargo: "Estagiário" },
  { id: 10, nome: "Letícia Pires", cidade: "SP", ativo: false, cargo: "Scrum Master" },
];

// ---------------------------------------------------------------
// GET /usuarios  -> lista com filtros (query params)
// Exemplos: /usuarios?cidade=SP  /usuarios?ativo=false  /usuarios?limite=2
// ---------------------------------------------------------------
app.get("/usuarios", (req, res) => {
  const { cidade, ativo, limite } = req.query;
  let resultado = usuarios;

  // Filtra por cidade (aceita maiúscula/minúscula)
  if (cidade) {
    resultado = resultado.filter((u) => u.cidade === cidade.toUpperCase());
  }

  // Filtra por status (a query chega como texto: "true" ou "false")
  if (ativo !== undefined) {
    resultado = resultado.filter((u) => String(u.ativo) === ativo);
  }

  if (resultado.length === 0) {
    return res.status(404).json({ mensagem: "Nenhum usuário encontrado" });
  }

  // Limita a quantidade de registros
  if (limite) {
    const qtd = parseInt(limite, 10);
    if (!isNaN(qtd) && qtd > 0) {
      resultado = resultado.slice(0, qtd);
    }
  }

  res.json(resultado);
});

// ---------------------------------------------------------------
// GET /usuarios/:id  -> busca um usuário (path param)
// ---------------------------------------------------------------
app.get("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

  res.json(usuario);
});

// ---------------------------------------------------------------
// POST /usuarios  -> cria um novo usuário (dados na query, como na aula)
// Exemplo: POST /usuarios?nome=Clara&cidade=GOIANIA
// ---------------------------------------------------------------
app.post("/usuarios", (req, res) => {
  const { nome, cidade } = req.query;

  // Validação do campo obrigatório
  if (!nome) {
    return res.status(400).json({ erro: "O nome é obrigatório" });
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome: nome,
    cidade: cidade ? cidade.toUpperCase() : "nao informado",
    ativo: true,
  };

  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// ---------------------------------------------------------------
// PUT /usuarios/:id  -> altera dados de um usuário existente
// O id vem na URL e os novos dados vêm no corpo (Body > JSON)
// ---------------------------------------------------------------
app.put("/usuarios/:id", (req, res) => {
  // 1. Pega o ID enviado na URL e converte para número
  const id = parseInt(req.params.id, 10);

  // 2. Busca o usuário correspondente no array
  const usuario = usuarios.find((u) => u.id === id);

  // Se o usuário não existir, retorna 404
  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

  // 3. Extrai os novos dados enviados no corpo da requisição
  const { nome, cidade, ativo } = req.body;

  // 4. Atualiza apenas os campos enviados (mantém os atuais se não informados)
  if (nome !== undefined) usuario.nome = nome;
  if (cidade !== undefined) usuario.cidade = cidade.toUpperCase();
  if (ativo !== undefined) usuario.ativo = ativo;

  // 5. Retorna o usuário com os dados já atualizados
  res.status(200).json(usuario);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
