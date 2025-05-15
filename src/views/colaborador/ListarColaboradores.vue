<template>
  <v-container>
    <h2>Lista de Colaboradores</h2>

    <v-data-table
      :headers="headers"
      :items="colaboradores"
      item-value="id"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.nome }}</td>
          <td>{{ item.equipe?.nome || 'Sem equipe' }}</td>
          <td>
            <v-btn icon color="blue" @click="editarColaborador(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="excluirColaborador(item)">
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
import ColaboradorService from "@/services/ColaboradoresService";

export default {
  name: "ListarColaboradores",
  data() {
    return {
      colaboradores: [],
      snackbarErro: false,
      mensagemErro: "",
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Ações", value: "actions", sortable: false }
      ]
    };
  },
  methods: {
    async carregarColaboradores() {
      try {
        this.colaboradores = await ColaboradorService.listarColaboradores();
      } catch (error) {
        console.error("Erro ao listar colaboradores", error);
        this.mensagemErro = "Erro ao carregar colaboradores";
        this.snackbarErro = true;
      }
    },
    editarColaborador(colaborador) {
      this.$router.push({ name: 'CadastrarColaborador', params: { id: colaborador.id } });
    },
    async excluirColaborador(colaborador) {
      try {
        await ColaboradorService.deletarColaborador(colaborador.id);
        this.carregarColaboradores();
      } catch (error) {
        this.mensagemErro = "Erro ao excluir colaborador";
        this.snackbarErro = true;
      }
    }
  },
  created() {
    this.carregarColaboradores();
  }
};
</script>
