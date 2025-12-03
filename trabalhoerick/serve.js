const express = require('express');
const serve = express();
const exphbs = require('express-handlebars');
const db = require('./config/database');

//models
const Filme = require('./models/filme.model');
const Genero = require('./models/genero.model');
const Sessao = require('./models/sessao.model');
const Ingresso = require('./models/ingresso.model');
const Ator = require('./models/ator.model');
const Critica = require('./models/critica.model');

//porta do servidor
const port = 3000;

serve.use(express.urlencoded({ extended: true }));
serve.engine('handlebars', exphbs.engine({ defaultLayout: false }));
serve.set('view engine', 'handlebars');



// filme // 


//tela inicial
serve.get('/', (req, res) => res.render('filme/home'));

//listar filmes
serve.get('/filmes', async (req, res) => {
  try {
    const filmes = await Filme.findAll({ raw: true });
    res.render('filme/listarFilmes', { filmes });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar filmes");
  }
});

//cadastrar novo filme
serve.get('/filmes/novo', (req, res) => {
  res.render('filme/cadastrarFilme');
});

//ver filme
serve.get('/filmes/ver/:id', async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id, { raw: true });
    res.render("filme/detalharFilme", { filme });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar filme");
  }
});

//editar filme
serve.get('/filmes/:id/editar', async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id, { raw: true });
    res.render('filme/editarFilme', { filme });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar filme para editar");
  }
});

serve.post('/filmes/:id/editar', async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id);
    filme.nome = req.body.nome;
    await filme.save();
    res.redirect('/filmes');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao editar filme");
  }
});

//criar filme
serve.post('/filmes', async (req, res) => {
  try {
    await Filme.create({ nome: req.body.nome });
    res.redirect('/filmes');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao criar filme");
  }
});

//excluir filme
serve.post('/filmes/excluir/:id', async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id);
    await filme.destroy();
    res.redirect('/filmes');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao excluir filme");
  }
});



// genero //


//listar generos
serve.get('/generos', async (req, res) => {
  try {
    const generos = await Genero.findAll({ raw: true });
    console.log('DEBUG generos:', generos);
    res.render('genero/listarGeneros', { generos });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar gêneros");
  }
});

//cadastrar genero
serve.get('/generos/novo', (req, res) => res.render('genero/cadastrarGenero'));

serve.post('/generos', async (req, res) => {
  try {
    await Genero.create({ nome: req.body.nome });
    res.redirect('/generos');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao criar gênero");
  }
});

//editar genero
serve.get('/generos/:id/editar', async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id, { raw: true });
    res.render('genero/editarGenero', { genero });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao editar gênero");
  }
});

serve.post('/generos/:id/editar', async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);
    genero.nome = req.body.nome;
    await genero.save();
    res.redirect('/generos');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao editar gênero");
  }
});

//excluir genero
serve.post('/generos/excluir/:id', async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);
    await genero.destroy();
    res.redirect('/generos');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao excluir gênero");
  }
});



// sessao //


//listar sessoes
serve.get('/sessoes', async (req, res) => {
  try {
    const sessoesInstances = await Sessao.findAll({ include: Filme });
    const sessoes = sessoesInstances.map(s => s.get ? s.get({ plain: true }) : s);
    console.log('DEBUG sessoes:', JSON.stringify(sessoes, null, 2));
    res.render('sessao/listarSessoes', { sessoes });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar sessões");
  }
});

//cadastrar sessao
serve.get('/sessoes/novo', async (req, res) => {
  const filmes = await Filme.findAll({ raw: true });
  res.render('sessao/cadastrarSessao', { filmes });
});

serve.post('/sessoes', async (req, res) => {
  try {
    console.log('DEBUG POST /sessoes body:', req.body);
    const created = await Sessao.create({
      dataHora: req.body.dataHora,
      FilmeId: req.body.filmeId
    });
    console.log('DEBUG created sessao:', created.get ? created.get({ plain: true }) : created);
    res.redirect('/sessoes');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao criar sessão");
  }
});

//excluir sessao
serve.post('/sessoes/excluir/:id', async (req, res) => {
  try {
    const sessao = await Sessao.findByPk(req.params.id);
    await sessao.destroy();
    res.redirect('/sessoes');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao excluir sessão");
  }
});



// INGRESSO //


//listar ingressos
serve.get('/ingressos', async (req, res) => {
  try {
    const ingressosInstances = await Ingresso.findAll({ include: Sessao });
    const ingressos = ingressosInstances.map(i => i.get ? i.get({ plain: true }) : i);
    res.render('ingresso/listarIngressos', { ingressos });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar ingressos");
  }
});

//comprar ingresso
serve.get('/ingressos/novo', async (req, res) => {
  const sessoesInstances = await Sessao.findAll({ include: Filme });
  const sessoes = sessoesInstances.map(s => s.get ? s.get({ plain: true }) : s);
  res.render('ingresso/comprarIngresso', { sessoes });
});

serve.post('/ingressos', async (req, res) => {
  try {
    console.log('DEBUG POST /ingressos body:', req.body);
    const created = await Ingresso.create({
      preco: req.body.preco,
      SessaoId: req.body.sessaoId
    });
    console.log('DEBUG created ingresso:', created.get ? created.get({ plain: true }) : created);
    res.redirect('/ingressos');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao comprar ingresso");
  }
});

//excluir ingresso
serve.post('/ingressos/excluir/:id', async (req, res) => {
  try {
    const ingresso = await Ingresso.findByPk(req.params.id);
    await ingresso.destroy();
    res.redirect('/ingressos');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao excluir ingresso");
  }
});



// ator //


//listar atores
serve.get('/atores', async (req, res) => {
  try {
    const atores = await Ator.findAll({ raw: true });
    console.log('DEBUG atores:', atores);
    res.render('ator/listarAtores', { atores });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar atores");
  }
});

//cadastrar ator
serve.get('/atores/novo', (req, res) => res.render('ator/cadastrarAtor'));

serve.post('/atores', async (req, res) => {
  try {
    await Ator.create({ nome: req.body.nome });
    res.redirect('/atores');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao criar ator");
  }
});

//editar ator
serve.get('/atores/:id/editar', async (req, res) => {
  try {
    const ator = await Ator.findByPk(req.params.id, { raw: true });
    res.render('ator/editarAtor', { ator });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao editar ator");
  }
});

serve.post('/atores/:id/editar', async (req, res) => {
  try {
    const ator = await Ator.findByPk(req.params.id);
    ator.nome = req.body.nome;
    await ator.save();
    res.redirect('/atores');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao editar ator");
  }
});

//excluir ator
serve.post('/atores/excluir/:id', async (req, res) => {
  try {
    const ator = await Ator.findByPk(req.params.id);
    await ator.destroy();
    res.redirect('/atores');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao excluir ator");
  }
});



// critica //


//listar criticas
serve.get('/criticas', async (req, res) => {
  try {
    const criticasInstances = await Critica.findAll({ include: Filme });
    const criticas = criticasInstances.map(c => c.get ? c.get({ plain: true }) : c);
    console.log('DEBUG criticas:', JSON.stringify(criticas, null, 2));
    res.render('critica/listarCriticas', { criticas });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao buscar críticas");
  }
});

//cadastrar critica
serve.get('/criticas/novo', async (req, res) => {
  const filmes = await Filme.findAll({ raw: true });
  res.render('critica/cadastrarCritica', { filmes });
});

serve.post('/criticas', async (req, res) => {
  try {
    console.log('DEBUG POST /criticas body:', req.body);
    const created = await Critica.create({
      autor: req.body.autor,
      texto: req.body.texto,
      nota: req.body.nota,
      FilmeId: req.body.filmeId
    });
    console.log('DEBUG created critica:', created.get ? created.get({ plain: true }) : created);
    res.redirect('/criticas');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao criar crítica");
  }
});

//excluir critica
serve.post('/criticas/excluir/:id', async (req, res) => {
  try {
    const critica = await Critica.findByPk(req.params.id);
    await critica.destroy();
    res.redirect('/criticas');
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Erro ao excluir crítica");
  }
});



// pra ve se o banco da pegando //


db.sync({ force: false })
  .then(() => console.log('Banco sincronizado'))
  .catch(erro => console.log('Erro ao sincronizar banco: ' + erro));

serve.listen(port, () => {
  console.log(`Servidor em execução: http://localhost:${port}`);
});
