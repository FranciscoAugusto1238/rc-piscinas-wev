<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <h2 style="margin-left: 0;">
        {{ id ? 'Editar Produto' : 'Cadastro de Produto' }}
      </h2>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="produto.nome"
            label="Nome"
            :rules="[v => !!v || 'Nome é obrigatório']"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="produto.codigoProduto"
            label="Código do Produto"
            :rules="[v => !!v || 'Código do Produto é obrigatório']"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="produto.tipoProduto"
            label="Tipo do Produto"
            :rules="[v => !!v || 'Tipo do Produto é obrigatório']"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="produto.valorProduto"
            label="Valor do Produto"
            type="number"
            min="0"
            step="0.01"
            :rules="[v => (v !== null && v >= 0) || 'Valor do Produto deve ser maior ou igual a 0']"
            required
          />
        </v-col>

        <!-- Novo campo para upload da imagem -->
        <v-col cols="12" md="6">
          <v-file-input
            label="Imagem do Produto"
            accept="image/*"
            @change="onFileChange"
            prepend-icon="mdi-image"
            outlined
            dense
            clearable
          ></v-file-input>
          <!-- Exibir preview da imagem -->
          <v-img
            v-if="produto.imagemBase64"
            :src="produto.imagemBase64"
            max-width="200"
            class="mt-3"
          ></v-img>
        </v-col>
      </v-row>
    </v-form>

    <v-container>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn @click="salvarProduto" :loading="buttonLoading" color="#388E3C" class="white--text">
            {{ id ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbarErro" color="red">
      {{ mensagemErro }}
    </v-snackbar>
    <v-snackbar v-model="snackbarSucesso" color="green">
      {{ mensagemSucesso }}
    </v-snackbar>
  </v-container>
</template>

<script>
import ProdutoService from '@/services/ProdutoService';

export default {
  name: "CadastroProduto",
  data() {
    return {
      valid: false,
      produto: {
        nome: "",
        codigoProduto: "",
        tipoProduto: "",
        valorProduto: null,
        imagemBase64: null, // campo para a imagem em base64
      },
      buttonLoading: false,
      mensagemErro: "",
      mensagemSucesso: "",
      snackbarErro: false,
      snackbarSucesso: false,
      id: null,
    };
  },
  created() {
    this.id = this.$route.params.id;
    if (this.id) {
      this.carregarProduto(this.id);
    }
  },
  watch: {
    '$route.params.id'(newId) {
      if (newId) {
        this.id = newId;
        this.carregarProduto(newId);
      } else {
        this.id = null;
        this.limparFormulario();
      }
    }
  },
  methods: {
    async carregarProduto(id) {
      try {
        const produto = await ProdutoService.buscarProdutoPorId(id);
        this.produto = {
          nome: produto.nome,
          codigoProduto: produto.codigoProduto,
          tipoProduto: produto.tipoProduto,
          valorProduto: produto.valorProduto,
          imagemBase64: produto.imagemBase64 || null, // carregar imagem se existir
        };
      } catch (error) {
        console.error("Erro ao carregar produto", error);
      }
    },

    // Converte arquivo para Base64
    onFileChange(file) {
      if (!file) {
        this.produto.imagemBase64 = null;
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.produto.imagemBase64 = reader.result;
      };
      reader.onerror = error => {
        console.error("Erro ao ler imagem", error);
        this.mensagemErro = "Erro ao carregar imagem.";
        this.snackbarErro = true;
      };
    },

    async salvarProduto() {
      if (!this.$refs.form.validate()) {
        this.mensagemErro = "Preencha todos os campos obrigatórios!";
        this.snackbarErro = true;
        return;
      }

      this.buttonLoading = true;

      try {
        if (this.id) {
          await ProdutoService.atualizarProduto(this.id, this.produto);
          this.mensagemSucesso = "Produto atualizado com sucesso!";
        } else {
          await ProdutoService.criarProduto(this.produto);
          this.mensagemSucesso = "Produto cadastrado com sucesso!";
          this.limparFormulario();
        }
        this.snackbarSucesso = true;
      } catch (error) {
        console.error("Erro ao salvar produto", error);
        this.mensagemErro = "Erro ao salvar produto! Tente novamente.";
        this.snackbarErro = true;
      } finally {
        this.buttonLoading = false;
      }
    },

    limparFormulario() {
      this.produto = {
        nome: "",
        codigoProduto: "",
        tipoProduto: "",
        valorProduto: null,
        imagemBase64: null,
      };
      this.$refs.form.resetValidation();
    },
  },
};
</script>
