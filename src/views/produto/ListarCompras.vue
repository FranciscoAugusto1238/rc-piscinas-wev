<template>
  <v-container>
    <h2>Lista de Compras</h2>

    <v-data-table
      :headers="headers"
      :items="compras"
      item-value="id"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ formatarData(item.dataCompra) }}</td>
          <td>{{ item.statusCompra }}</td>
          <td>
            <ul>
              <li
                v-for="produto in item.produtos"
                :key="produto.id"
              >
                {{ produto.produto?.nome || '—' }} - Qtd: {{ produto.quantidade }} - R$ {{ produto.valorUnitario.toFixed(2) }}
              </li>
            </ul>
          </td>
          <td>
            <v-btn icon color="blue" @click="editarCompra(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="excluirCompra(item)">
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
import CompraProdutoService from '@/services/CompraProdutoService';

export default {
  name: "ListarCompras",
  data() {
    return {
      compras: [],
      snackbarErro: false,
      mensagemErro: "",
      headers: [
        { text: "Data da Compra", value: "dataCompra" },
        { text: "Status", value: "statusCompra" },
        { text: "Produtos", value: "produtos" },
        { text: "Ações", value: "actions", sortable: false }
      ]
    };
  },
  methods: {
    async carregarCompras() {
      try {
       
        this.compras = await CompraProdutoService.listarPorCompra();
      } catch (error) {
        console.error("Erro ao listar compras", error);
        this.mensagemErro = "Erro ao carregar compras";
        this.snackbarErro = true;
      }
    },
    formatarData(data) {
      if (!data) return "—";
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    },
    editarCompra(compra) {
      this.$router.push({ name: 'EditarCompra', params: { id: compra.id } });
    },
    excluirCompra(compra) {
      alert(`Excluir compra ID: ${compra.id}`);
    }
  },
  created() {
    this.carregarCompras();
  }
};
</script>
