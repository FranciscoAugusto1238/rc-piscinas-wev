<template>
  <a-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <h2 style="margin-left: 0;">{{ id ? 'Editar Equipe' : 'Cadastro de Equipe' }}</h2>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="equipe.nome"
            label="Nome da Equipe"
            :rules="[v => !!v || 'Este campo é obrigatório']"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="equipe.usuarioCriador"
            :items="usuarios"
            item-text="nome"
            item-value="id"
            label="Usuário Criador"
            :rules="[v => !!v || 'Este campo é obrigatório']"
            required
          />
        </v-col>
      </v-row>
    </v-form>

    <a-container>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            @click="salvarEquipe"
            :loading="buttonLoading"
            color="#388E3C"
            class="white--text"
          >
            {{ id ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </v-col>
      </v-row>
    </a-container>

    <v-snackbar v-model="snackbarErro" color="red">
      {{ mensagemErro }}
    </v-snackbar>
    <v-snackbar v-model="snackbarSucesso" color="green">
      {{ mensagemSucesso }}
    </v-snackbar>
  </a-container>
</template>

<script>
import EquipeService from '@/services/EquipeService';
import UsuarioService from '@/services/UsuarioService';

export default {
  name: "CadastrarEquipe",
  data() {
    return {
      valid: false,
      equipe: {
        nome: '',
        usuarioCriador: null
      },
      usuarios: [],
      buttonLoading: false,
      mensagemErro: '',
      mensagemSucesso: '',
      snackbarErro: false,
      snackbarSucesso: false,
    };
  },
  computed: {
    id() {
      return this.$route.params.id || null;
    }
  },
  async created() {
    this.usuarios = await UsuarioService.listarUsuarios();

    if (this.id) {
      this.carregarEquipe(this.id);
    }
  },
  watch: {
    '$route.params.id'(newId) {
      if (newId) {
        this.carregarEquipe(newId);
      } else {
        this.limparFormulario();
      }
    }
  },
  methods: {
    async carregarEquipe(id) {
      try {
        const equipe = await EquipeService.buscarEquipePorId(id);
        this.equipe = {
          nome: equipe.nome,
          usuarioCriador: equipe.usuarioCriador?.id || null
        };
      } catch (error) {
        console.error("Erro ao carregar equipe", error);
        this.mensagemErro = "Erro ao carregar equipe!";
        this.snackbarErro = true;
      }
    },
    async salvarEquipe() {
      if (!this.$refs.form.validate()) {
        this.mensagemErro = "Preencha todos os campos obrigatórios!";
        this.snackbarErro = true;
        return;
      }

      this.buttonLoading = true;

      try {
        if (this.id) {
          await EquipeService.atualizarEquipe(this.id, {
            nome: this.equipe.nome,
            usuarioCriador: { id: this.equipe.usuarioCriador }
          });
          this.mensagemSucesso = "Equipe atualizada com sucesso!";
        } else {
          await EquipeService.criarEquipe({
            nome: this.equipe.nome,
            usuarioCriador: { id: this.equipe.usuarioCriador }
          });
          this.mensagemSucesso = "Equipe cadastrada com sucesso!";
          this.limparFormulario();
        }
        this.snackbarSucesso = true;
      } catch (error) {
        console.error("Erro ao salvar equipe", error);
        this.mensagemErro = "Erro ao salvar equipe! Tente novamente.";
        this.snackbarErro = true;
      } finally {
        this.buttonLoading = false;
      }
    },
    limparFormulario() {
      this.equipe = {
        nome: '',
        usuarioCriador: null
      };
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.title {
  text-align: center;
}
</style>
