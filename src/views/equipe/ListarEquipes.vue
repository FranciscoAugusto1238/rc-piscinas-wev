<template>
  <v-container>
    <h2>Lista de Equipes</h2>

    <v-data-table
      :headers="headers"
      :items="equipes"
      item-value="id"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.nome }}</td>
          <td>{{ item.usuarioCriador?.nome || '—' }}</td>
          <td>
            <v-btn icon color="blue" @click="editarEquipe(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="excluirEquipe(item)">
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
import EquipeService from "@/services/EquipeService";

export default {
  name: "ListarEquipes",
  data() {
    return {
      equipes: [],
      snackbarErro: false,
      mensagemErro: "",
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Usuário Criador", value: "usuarioCriador.nome" },
        { text: "Ações", value: "actions", sortable: false }
      ]
    };
  },
  methods: {
    async carregarEquipes() {
      try {
        this.equipes = await EquipeService.listarEquipesAtivas();
      } catch (error) {
        console.error("Erro ao listar equipes", error);
        this.mensagemErro = "Erro ao carregar equipes";
        this.snackbarErro = true;
      }
    },
    editarEquipe(equipe) {
      this.$router.push({ name: 'CadastrarEquipe', params: { id: equipe.id } });
    },
    excluirEquipe(equipe) {
      alert(`Excluir equipe: ${equipe.nome}`);
    }
  },
  created() {
    this.carregarEquipes();
  }
};
</script>
