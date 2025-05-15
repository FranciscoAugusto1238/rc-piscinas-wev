<template>
  <a-container class="pa-5">
    <v-form ref="form" v-model="valid" lazy-validation>
      <h2 class="text-h5 font-weight-bold mb-4">🛒 Comprar Produtos</h2>

      <v-row align="stretch" class="mb-4">
        <v-col cols="12" md="6">
          <v-card class="pa-4" elevation="2">
            <v-select
              v-model="novoProduto.produto"
              :items="produtosDisponiveis"
              item-text="nome"
              item-value="id"
              label="Selecione um Produto"
              :rules="[v => !!v || 'Produto é obrigatório']"
              outlined
              dense
            />
            <v-text-field
              v-model.number="novoProduto.quantidade"
              label="Quantidade"
              type="number"
              class="mt-4"
              :rules="[v => v > 0 || 'Quantidade deve ser maior que zero']"
              outlined
              dense
              required
            />
            <v-text-field
              v-model.number="novoProduto.valorProduto"
              label="Valor Total"
              type="number"
              outlined
              dense
              readonly
              class="mt-2"
            />
            <v-btn @click="adicionarProduto" color="success" class="mt-4 white--text" block>
              Adicionar Produto
            </v-btn>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" v-if="imagemProdutoSelecionado">
          <v-card elevation="2" class="pa-2 d-flex align-center justify-center h-100">
            <v-img
              :src="ajustarImagemBase64(imagemProdutoSelecionado)"
              height="250px"
              contain
              class="rounded-lg elevation-3"
            />
          </v-card>
        </v-col>
      </v-row>
      <v-card class="mb-6" elevation="2">
        <v-data-table
          :headers="headers"
          :items="itensComprados"
          item-value="id"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="grey lighten-4">
              <v-toolbar-title class="font-weight-medium">🧾 Produtos Selecionados</v-toolbar-title>
            </v-toolbar>
          </template>

          <template v-slot:[`item.produto`]="{ item }">
            <v-row no-gutters align="center">
              <v-col cols="8">
                <span>{{ item.produto.nome }}</span>
              </v-col>
            </v-row>
          </template>

          <template v-slot:[`item.valorUnitario`]="{ item }">
            <span>{{ item.valorUnitario.toFixed(2) }}</span>
          </template>

          <template v-slot:[`item.acao`]="{ item }">
            <v-btn icon @click="removerProduto(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn @click="finalizarCompra" :loading="buttonLoading" color="#388E3C" class="white--text">
            Finalizar Compra
          </v-btn>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbarErro" color="red">
        {{ mensagemErro }}
      </v-snackbar>
      <v-snackbar v-model="snackbarSucesso" color="green">
        {{ mensagemSucesso }}
      </v-snackbar>
    </v-form>
  </a-container>
</template>


<script>
import CompraProdutoService from "@/services/CompraProdutoService";
import ProdutoService from "@/services/ProdutoService";

export default {
  name: "CompraProduto",
  data() {
    return {
      valid: false,
      produtosDisponiveis: [],
      novoProduto: {
        produto: null,
        quantidade: 1,
        valorProduto: 0,
      },
      itensComprados: [],
      headers: [
        { text: "Produto", value: "produto" },
        { text: "Quantidade", value: "quantidade" },
        { text: "Valor Total", value: "valorUnitario" },
        { text: "Ações", value: "acao", sortable: false },
      ],
      buttonLoading: false,
      mensagemErro: "",
      mensagemSucesso: "",
      snackbarErro: false,
      snackbarSucesso: false,
    };
  },
  computed: {
    imagemProdutoSelecionado() {
      const produto = this.produtosDisponiveis.find(
        p => p.id === this.novoProduto.produto
      );
      return produto?.imagemBase64 || null;
    }
  },
  watch: {
    'novoProduto.produto'() {
      this.atualizarValorProduto();
    },
    'novoProduto.quantidade'() {
      this.atualizarValorProduto();
    },
  },
  async created() {
    await this.carregarProdutos();
  },
  methods: {
    ajustarImagemBase64(base64String) {
      if (!base64String) return '';
      return base64String.startsWith('data:image')
        ? base64String
        : 'data:image/png;base64,' + base64String;
    },

    async carregarProdutos() {
      try {
        this.produtosDisponiveis = await ProdutoService.listarProdutos();
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
      }
    },

    atualizarValorProduto() {
      const produto = this.produtosDisponiveis.find(
        p => p.id === this.novoProduto.produto
      );
      this.novoProduto.valorProduto =
        produto && this.novoProduto.quantidade > 0
          ? produto.valorProduto * this.novoProduto.quantidade
          : 0;
    },

    adicionarProduto() {
      if (!this.novoProduto.produto || this.novoProduto.quantidade <= 0) {
        this.mensagemErro = "Selecione um produto e insira uma quantidade válida.";
        this.snackbarErro = true;
        return;
      }

      const produtoSelecionado = this.produtosDisponiveis.find(
        p => p.id === this.novoProduto.produto
      );
      const valorUnitario = produtoSelecionado.valorProduto;
      const quantidade = this.novoProduto.quantidade;

      this.itensComprados.push({
        produto: produtoSelecionado,
        quantidade,
        valorUnitario: valorUnitario * quantidade,
      });

      this.novoProduto = { produto: null, quantidade: 1, valorProduto: 0 };
    },

    removerProduto(item) {
      const index = this.itensComprados.indexOf(item);
      if (index !== -1) {
        this.itensComprados.splice(index, 1);
      }
    },

    async finalizarCompra() {
      if (this.itensComprados.length === 0) {
        this.mensagemErro = "Adicione pelo menos um produto antes de finalizar.";
        this.snackbarErro = true;
        return;
      }

      this.buttonLoading = true;

      try {
        await CompraProdutoService.adicionarProduto(this.itensComprados);
        this.mensagemSucesso = "Compra realizada com sucesso!";
        this.snackbarSucesso = true;
        this.itensComprados = [];
      } catch (error) {
        console.error("Erro ao finalizar compra", error);
        this.mensagemErro = "Erro ao finalizar compra. Tente novamente.";
        this.snackbarErro = true;
      } finally {
        this.buttonLoading = false;
      }
    }
  }
};
</script>
