<template>
  <v-app>
    <v-app-bar color="primary" dark app elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>RC Piscinas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout" title="Logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      dark
      color="grey lighten-2"
      shaped
      class="rounded-xl drawer-custom"
    >
      <v-list>
        <v-list-item to="/home">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="black--text">Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Produto (visível só para ADMIN) -->
        <template v-if="isAdmin">
          <v-list-group v-model="menuProduto" :prepend-icon="'mdi-cart-plus'">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-cart-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Produto</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastro-produto">
              <v-list-item-icon>
                <v-icon>mdi-cart-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Produto</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-produtos">
              <v-list-item-icon>
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Produtos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Usuário (visível só para ADMIN) -->
        <template v-if="isAdmin">
          <v-list-group v-model="menuUsuario" :prepend-icon="'mdi-account'">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Usuário</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastrar-usuario">
              <v-list-item-icon>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Usuário</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-usuario">
              <v-list-item-icon>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Usuários</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Colaborador (visível só para ADMIN) -->
        <template v-if="isAdmin">
          <v-list-group v-model="menuColaborador" :prepend-icon="'mdi-account-group'">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Colaborador</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastrar-colaborador">
              <v-list-item-icon>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Colaborador</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-colaborador">
              <v-list-item-icon>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Colaboradores</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Equipe (visível só para ADMIN) -->
        <template v-if="isAdmin">
          <v-list-group v-model="menuEquipe" :prepend-icon="'mdi-account-group-outline'">
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account-group-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="black--text">Equipe</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list-item to="/cadastrar-equipe">
              <v-list-item-icon>
                <v-icon>mdi-account-plus-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Cadastrar Equipe</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item to="/listar-equipe">
              <v-list-item-icon>
                <v-icon>mdi-format-list-bulleted</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Lista de Equipes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>

        <!-- Grupo Atendimento (sempre visível) -->
        <v-list-group v-model="menuAtendimento" :prepend-icon="'mdi-headset'">
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-headset</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Atendimento</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item to="/cadastrar-chamado-atendimeno">
            <v-list-item-icon>
              <v-icon>mdi-note-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Cadastrar Chamado</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/listar-chamado-atendimeno">
            <v-list-item-icon>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Lista de Chamados</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <!-- Grupo Compras (sempre visível) -->
        <v-list-group v-model="menuCompras" :prepend-icon="'mdi-cart'">
          <template v-slot:activator>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-cart</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="black--text">Compras</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item to="/compra-produto">
            <v-list-item-icon>
              <v-icon>mdi-cart-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Comprar Produto</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/listar-compras">
            <v-list-item-icon>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="black--text">Lista de Compras</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "HomeTela",
  data() {
    return {
      drawer: false,
      menuProduto: false,
      menuUsuario: false,
      menuColaborador: false,
      menuEquipe: false,
      menuAtendimento: false,
      menuCompras: false,
      usuarioLogado: null,
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
  },
};
</script>
