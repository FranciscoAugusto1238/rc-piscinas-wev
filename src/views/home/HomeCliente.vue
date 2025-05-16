<template>
  <v-container fluid class="pa-0">
    <v-parallax
      src="https://scontent.fcfc5-1.fna.fbcdn.net/v/t39.30808-6/497917348_122096436650879007_3078023965751206342_n.png?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=4kJ_szYCuAMQ7kNvwFNCCJ7&_nc_oc=Adm1VvOfyhYpOR-R_pHi2Os1kXW_5SNke0wCfgizeOGFYKEnmwayYmB5UExfsflhUyU95ZRxC1iKez0V9sdAvoFm&_nc_zt=23&_nc_ht=scontent.fcfc5-1.fna&_nc_gid=--ryd_0p4x1FfsbgtGTi0g&oh=00_AfLW0d9ip5GUovRGW4AWnoMgUdWCLE8QDnSes6sUIX8mmQ&oe=682C7500"
      height="1000"
    >
      <v-row
        class="fill-height"
        align="center"
        justify="center"
        style="background-color: rgba(0, 0, 0, 0.4);"
      >
        <v-col class="text-center white--text">
          <h1 class="display-2 font-weight-bold mb-3">RC Piscinas</h1>
          <h2 class="subtitle-1 mb-5">Tudo para sua piscina: Produtos e Serviços de Limpeza</h2>
          <v-btn
            color="pink lighten-2"
            class="white--text"
            large
            rounded
            href="#produtos"
          >
            Confira nossos produtos
          </v-btn>
        </v-col>
      </v-row>
    </v-parallax>
    <v-container id="produtos" class="my-12">
      <h2 class="text-center font-weight-bold mb-8">Produtos em Destaque</h2>
      <v-row dense>
        <v-col
          v-for="produto in produtos"
          :key="produto.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card elevation="6" shaped>
            <v-img
              v-if="produto.imagemBase64"
              :src="ajustarImagemBase64(produto.imagemBase64)"
              height="200px"
              class="white--text align-end"
            >
              <v-card-title
                class="bg-gradient"
                style="background: linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
              >
                {{ produto.nome }}
              </v-card-title>
            </v-img>
            <v-card-text>
              <p>Tipo: {{ produto.tipoProduto }}</p>
              <p>Código: {{ produto.codigoProduto }}</p>
              <h3 class="font-weight-bold teal--text">
                {{ formatarValor(produto.valorProduto) }}
              </h3>
            </v-card-text>
            <v-card-actions>
              <v-btn color="teal" text @click="irParaProduto(produto.id)">Ver detalhes</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="pink" dark @click="adicionarCarrinho(produto)">Comprar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">{{ produtoSelecionado.nome }}</v-card-title>
        <v-card-text>
          <p><strong>Tipo:</strong> {{ produtoSelecionado.tipoProduto }}</p>
          <p><strong>Código:</strong> {{ produtoSelecionado.codigoProduto }}</p>
          <p><strong>Valor:</strong> {{ formatarValor(produtoSelecionado.valorProduto) }}</p>
          <p><strong>Descrição:</strong></p>
          <p>{{ produtoSelecionado.descricao }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="red" @click="dialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container class="my-12 pa-8 teal lighten-5 rounded-lg">
      <h2 class="text-center font-weight-bold mb-8 teal--text text--darken-4">
        Serviços de Limpeza de Piscinas
      </h2>
      <v-row align="center" justify="center" dense>
        <v-col cols="12" md="6">
          <v-img
            src="https://images.unsplash.com/photo-1562774056-2f2f917182b8?auto=format&fit=crop&w=800&q=80"
            alt="Limpeza de piscina"
            aspect-ratio="1.5"
            class="rounded-lg"
          ></v-img>
        </v-col>
        <v-col cols="12" md="6">
          <p>
            Mantenha sua piscina sempre limpa e segura com nosso serviço especializado de limpeza e manutenção. 
            Utilizamos equipamentos modernos e produtos de qualidade para garantir uma água cristalina e saudável.
          </p>
          <ul>
            <li>Limpeza periódica com equipe qualificada</li>
            <li>Tratamento químico personalizado</li>
            <li>Verificação e manutenção do sistema de filtragem</li>
            <li>Atendimento rápido e eficiente</li>
          </ul>
          <v-btn color="teal darken-2" class="white--text mt-4" @click="irParaContato">
            Solicite um orçamento
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbarErro" color="red">
      {{ mensagemErro }}
    </v-snackbar>

  </v-container>
</template>

<script>
import ProdutoService from '@/services/ProdutoService';

export default {
  name: "HomeCliente",
  data() {
    return {
      produtos: [],
      dialog: false,
      produtoSelecionado: {},
      snackbarErro: false,
      mensagemErro: ""
    };
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
        this.produtos = await ProdutoService.listarProdutos();
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
        this.mensagemErro = "Erro ao carregar produtos";
        this.snackbarErro = true;
      }
    },
    formatarValor(valor) {
      return valor != null
        ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : '-';
    },
    irParaProduto(id) {
      const produto = this.produtos.find(p => p.id === id);
      if (produto) {
        this.produtoSelecionado = produto;
        this.dialog = true;
      }
    },
    adicionarCarrinho(produto) {
      const telefone = "4991710961";
      const mensagem = `Olá, quero comprar o seguinte produto:
- Nome: ${produto.nome}
- Tipo: ${produto.tipoProduto}
- Código: ${produto.codigoProduto}
- Valor: ${this.formatarValor(produto.valorProduto)}
- Descrição: ${produto.descricao || 'N/A'}`;
      const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");
    },
    irParaContato() {
      this.$router.push("/contato");
    },
  },
  created() {
    this.carregarProdutos();
  },
};
</script>

<style scoped>
.bg-gradient {
  color: white;
  font-weight: 600;
}
ul {
  padding-left: 1.2rem;
}
li {
  margin-bottom: 8px;
}
</style>
