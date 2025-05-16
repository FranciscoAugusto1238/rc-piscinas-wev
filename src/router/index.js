import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '../views/login/LoginTela.vue';
import Home from '../views/home/HomeTela.vue';
import HomeCliente from '../views/home/HomeCliente.vue';
import CadastroProduto from '../views/produto/CadastrarProduto.vue';
import ListaProdutos from '../views/produto/ListarProduto.vue';
import CadastrarUsuario from '../views/usuario/CadastrarUsuario.vue';
import ListaUsuarios from '../views/usuario/ListaUsuarios.vue';
import CadastrarColaborador from '../views/colaborador/CadastrarColaborador.vue';
import ListarColaboradores from '../views/colaborador/ListarColaboradores.vue';
import CadastrarEquipe from '../views/equipe/CadastrarEquipe.vue';
import ListarEquipes from '../views/equipe/ListarEquipes.vue';
import ChamadoAtendimentoForm from '../views/atendimento/ChamadoAtendimentoView.vue';
import ListarChamadoAtendimento from '../views/atendimento/ListarChamadoAtendimento.vue';
import CompraProdutoForm from '../views/produto/CompraProdutoForm.vue';
import ListarCompras from '../views/produto/ListarCompras.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: Home,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'Home', component: Home },
      { path: 'principal', name: 'HomeCliente', component: HomeCliente },
      { path: 'cadastro-produto/:id?', name: 'CadastroProduto', component: CadastroProduto },
      { path: 'listar-produtos', name: 'ListaProdutos', component: ListaProdutos },
      { path: 'cadastrar-usuario/:id?', name: 'CadastrarUsuario', component: CadastrarUsuario },
      { path: 'listar-usuario', name: 'ListaUsuarios', component: ListaUsuarios },
      { path: 'cadastrar-colaborador/:id?', name: 'CadastrarColaborador', component: CadastrarColaborador },
      { path: 'cadastrar-equipe/:id?', name: 'CadastrarEquipe', component: CadastrarEquipe },
      { path: 'listar-equipe', name: 'ListarEquipes', component: ListarEquipes },
      { path: 'listar-colaborador', name: 'ListarColaboradores', component: ListarColaboradores },
      { path: 'cadastrar-chamado-atendimeno/:id?', name: 'ChamadoAtendimentoForm', component: ChamadoAtendimentoForm },
      { path: 'listar-chamado-atendimeno', name: 'ListarChamadoAtendimento', component: ListarChamadoAtendimento },
      { path: 'compra-produto/:id?', name: 'CompraProdutoForm', component: CompraProdutoForm },
      { path: 'listar-compras', name: 'ListarCompras', component: ListarCompras },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login','/cadastrar-usuario','/principal'];
  const authRequired = !publicPages.includes(to.path);
  const usuarioLogado = localStorage.getItem('usuarioLogado');

  if (authRequired && !usuarioLogado) {
    return next('/login');
  }

  next();
});

export default router;
