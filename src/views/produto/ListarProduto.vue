<template>
  <v-container>
    <h2>Lista de Produtos</h2>

    <v-row>
      <v-col
        v-for="produto in produtos"
        :key="produto.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img
  v-if="produto.imagemBase64"
  :src="ajustarImagemBase64(produto.imagemBase64)"
  height="200px"
/>

          <v-card-title>{{ produto.nome }}</v-card-title>
          <v-card-subtitle>Código: {{ produto.codigoProduto }}</v-card-subtitle>
          <v-card-text>
            Tipo: {{ produto.tipoProduto }}<br />
            Valor: {{ formatarValor(produto.valorProduto) }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon color="blue" @click="editarProduto(produto)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="excluirProduto(produto)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbarErro" color="red">
      {{ mensagemErro }}
    </v-snackbar>
  </v-container>
</template>

<script>
import ProdutoService from '@/services/ProdutoService';

export default {
  name: "ListarProdutos",
  data() {
    return {
      produtos: [],
      snackbarErro: false,
      mensagemErro: ""
    };
  },
  methods: {
    ajustarImagemBase64(base64String) {
    if (!base64String) return '';
    if (base64String.startsWith('data:image')) {
      return base64String;  // já está no formato correto
    } else {
      return 'data:image/png;base64,' + base64String;  // adiciona prefixo
    }
  },
    async carregarProdutos() {
      try {
        this.produtos = await ProdutoService.listarProdutos();
      } catch (error) {
        console.error("Erro ao listar produtos", error);
        this.mensagemErro = "Erro ao carregar produtos";
        this.snackbarErro = true;
      }
    },
    editarProduto(produto) {
      this.$router.push({ name: 'CadastroProduto', params: { id: produto.id } });
    },
    async excluirProduto(produto) {
      if (confirm(`Tem certeza que deseja excluir o produto: ${produto.nome}?`)) {
        try {
          await ProdutoService.deletarProduto(produto.id);
          this.carregarProdutos();
        } catch (error) {
          console.error("Erro ao excluir produto", error);
          this.mensagemErro = "Erro ao excluir produto";
          this.snackbarErro = true;
        }
      }
    },
    formatarValor(valor) {
      return valor != null ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
    }
  },
  created() {
    this.carregarProdutos();
  }
};
</script>
