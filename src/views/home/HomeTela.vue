<template>
  <v-app>
    <!-- Top bar -->
    <v-app-bar color="teal darken-3" dark app elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">RC Piscinas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout" title="Sair" v-if="usuarioLogado">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense nav>
        <v-list-item to="/principal" exact>
          <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Home</v-list-item-title></v-list-item-content>
        </v-list-item>

        <template v-if="isAdmin">
          <v-list-group v-model="menuProduto" prepend-icon="mdi-cart-plus">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon><v-icon>mdi-cart-plus</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Produto</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastro-produto">
              <v-list-item-icon><v-icon>mdi-cart-plus</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Produto</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-produtos">
              <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Produtos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Usuário (visível só para ADMIN) -->
        <template v-if="isAdmin">
          <v-list-group v-model="menuUsuario" prepend-icon="mdi-account">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Usuário</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastrar-usuario">
              <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Usuário</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-usuario">
              <v-list-item-icon><v-icon>mdi-account-multiple</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Usuários</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Colaborador (visível só para ADMIN) -->
        <template v-if="isAdmin">
          <v-list-group v-model="menuColaborador" prepend-icon="mdi-account-group">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Colaborador</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastrar-colaborador">
              <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Colaborador</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-colaborador">
              <v-list-item-icon><v-icon>mdi-account-multiple</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Colaboradores</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Equipe (visível só para ADMIN) -->
        <template v-if="isAdmin">
          <v-list-group v-model="menuEquipe" prepend-icon="mdi-account-group-outline">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon><v-icon>mdi-account-group-outline</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Equipe</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastrar-equipe">
              <v-list-item-icon><v-icon>mdi-account-plus-outline</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Equipe</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-equipe">
              <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Equipes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Grupo Atendimento (sempre visível) -->
        <v-list-group v-model="menuAtendimento" prepend-icon="mdi-headset">
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-icon><v-icon>mdi-headset</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Atendimento</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item to="/cadastrar-chamado-atendimeno">
            <v-list-item-icon><v-icon>mdi-note-plus</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Cadastrar Chamado</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/listar-chamado-atendimeno">
            <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Lista de Chamados</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <!-- Grupo Compras (sempre visível) -->
        <v-list-group v-model="menuCompras" prepend-icon="mdi-cart">
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-icon><v-icon>mdi-cart</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Compras</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item to="/compra-produto">
            <v-list-item-icon><v-icon>mdi-cart-plus</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Comprar Produto</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/listar-compras">
            <v-list-item-icon><v-icon>mdi-format-list-bulleted</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Lista de Compras</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>
    <!-- Footer -->
    <v-footer color="teal darken-3" dark app>
      <v-container>
        <v-row justify="space-between" align="center">
          <v-col cols="12" md="4" class="text-center text-md-left">
            <div class="font-weight-bold">RC Piscinas</div>
            <small>© 2025 - Todos os direitos reservados.</small>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon large class="mr-4" @click="abrirRedeSocial('facebook')">mdi-facebook</v-icon>
            <v-icon large class="mr-4" @click="abrirRedeSocial('instagram')">mdi-instagram</v-icon>
            <v-icon large @click="abrirRedeSocial('whatsapp')">mdi-whatsapp</v-icon>
          </v-col>
          <v-col cols="12" md="4" class="text-center text-md-right">
            <div>Contato: (49) 99171-0961</div>
            <div>Email: ronaldo.piscinas@yahoo.com</div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "HomeTela",
  data() {
    return {
      drawer: false,
      usuarioLogado: null,
      menuProduto: false,
      menuUsuario: false,
      menuColaborador: false,
      menuEquipe: false,
      menuAtendimento: false,
      menuCompras: false,
    };
  },
  computed: {
    isAdmin() {
      return this.usuarioLogado && this.usuarioLogado.permissao === 'ADMIN';
    },
  },
  created() {
    const usuarioStr = localStorage.getItem("usuarioLogado");
    if (usuarioStr) {
      this.usuarioLogado = JSON.parse(usuarioStr);
      console.log("Usuário logado:", this.usuarioLogado);
    } else {
      console.log("Nenhum usuário logado");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("usuarioLogado");
      this.$router.push("/login");
    },
    irParaProduto(id) {
      this.$router.push(`/produto/${id}`);
    },
    adicionarCarrinho(produto) {
      // Lógica para adicionar ao carrinho (implemente conforme seu sistema)
      alert(`Produto "${produto.nome}" adicionado ao carrinho!`);
    },
    irParaContato() {
      this.$router.push("/contato");
    },
    abrirRedeSocial(rede) {
      const urls = {
        facebook: "https://www.facebook.com/people/Ronaldo-Piscinas-RN/61576370217048/",
        instagram: "https://www.instagram.com/ronaldopiscinas2025?igsh=cXZ4dWFjaHc0YXJw",
        whatsapp: "https://wa.me/55(49) 991710961",
      };
      window.open(urls[rede], "_blank");
    },
  },
};
</script>

<style scoped>
.bg-gradient {
  color: white;
  font-weight: 600;
}
.drawer-custom {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}
ul {
  padding-left: 1.2rem;
}
li {
  margin-bottom: 8px;
}
</style>
