<template>
  <v-container>
    <h2>Lista de Usuários</h2>

    <v-data-table
      :headers="headers"
      :items="usuarios"
      item-value="id"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.nome }}</td>
          <td>{{ item.cpf }}</td>
          <td>
            <v-btn icon color="blue" @click="editarUsuario(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="excluirUsuario(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbarErro" color="red">
      {{ mensagemErro }}
    </v-snackbar>
  </v-container>
</template>


<script>
import UsuarioService from "@/services/UsuarioService";

export default {
  name: "ListarUsuarios",
  data() {
    return {
      usuarios: [],
      snackbarErro: false,
      mensagemErro: "",
      headers: [
        { text: "Nome", value: "nome" },
        { text: "CPF", value: "cpf" },
        { text: "Ações", value: "actions", sortable: false }
      ]
    };
  },
  methods: {
    async carregarUsuarios() {
      try {
        this.usuarios = await UsuarioService.listarUsuarios();
      } catch (error) {
        console.error("Erro ao listar usuários", error);
        this.mensagemErro = "Erro ao carregar usuários";
        this.snackbarErro = true;
      }
    },
    editarUsuario(usuario) {
        this.$router.push({ name: 'CadastrarUsuario', params: { id: usuario.id } });
    },
    excluirUsuario(usuario) {
      alert(`Excluir usuário: ${usuario.nome}`);
    }
  },
  created() {
    this.carregarUsuarios();
  }
};
</script>
