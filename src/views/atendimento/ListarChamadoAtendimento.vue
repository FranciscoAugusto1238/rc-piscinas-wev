<template>
  <v-container>
    <h2>Lista de Chamados de Atendimento</h2>

    <v-data-table
      :headers="headers"
      :items="chamados"
      item-value="id"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.titulo }}</td>
          <td>{{ item.usuario?.nome || '—' }}</td>
          <td>{{ formatarData(item.dataAtendimento) }}</td>
          <td>
            <v-btn icon color="blue" @click="editarChamado(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="excluirChamado(item)">
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
import ChamadoAtendimentoService from '@/services/ChamadoAtendimentoService';
import { format } from 'date-fns';

export default {
  name: 'ListarChamadosAtendimento',
  data() {
    return {
      chamados: [],
      snackbarErro: false,
      mensagemErro: '',
      headers: [
        { text: 'Título', value: 'titulo' },
        { text: 'Usuário', value: 'usuario.nome' },
        { text: 'Data Atendimento', value: 'dataAtendimento' },
        { text: 'Ações', value: 'actions', sortable: false }
      ]
    };
  },
  methods: {
    async carregarChamados() {
      try {
        this.chamados = await ChamadoAtendimentoService.listarChamadosAtivos();
      } catch (error) {
        console.error('Erro ao listar chamados', error);
        this.mensagemErro = 'Erro ao carregar chamados';
        this.snackbarErro = true;
      }
    },
    editarChamado(chamado) {
      this.$router.push({ name: 'ChamadoAtendimentoForm', params: { id: chamado.id } });
    },
    async excluirChamado(chamado) {
      if (confirm(`Deseja realmente excluir o chamado: ${chamado.titulo}?`)) {
        try {
          await ChamadoAtendimentoService.excluirChamado(chamado.id);
          this.carregarChamados();
        } catch (error) {
          console.error('Erro ao excluir chamado', error);
          this.mensagemErro = 'Erro ao excluir chamado';
          this.snackbarErro = true;
        }
      }
    },
    formatarData(data) {
      if (!data) return '—';
      return format(new Date(data), 'dd/MM/yyyy HH:mm');
    }
  },
  created() {
    this.carregarChamados();
  }
};
</script>
