<template>
  <v-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <h2>{{ id ? 'Editar Chamado' : 'Cadastro de Chamado' }}</h2>

      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="chamado.usuario"
            :items="usuarios"
            item-text="nome"
            item-value="id"
            label="Usuário"
            :rules="[v => !!v || 'Usuário é obrigatório']"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="chamado.idade"
            label="Idade"
            type="number"
            :rules="[v => !!v || 'Idade é obrigatória']"
            required
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field
            v-model="chamado.endereco"
            label="Endereço"
            :rules="[v => !!v || 'Endereço é obrigatório']"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-menu
            v-model="menuData"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dataFormatada"
                label="Data de Atendimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="chamado.dataAtendimento" @input="menuData = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-form>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          @click="salvarChamado"
          :loading="buttonLoading"
          color="#1976D2"
          class="white--text"
        >
          {{ id ? 'Atualizar' : 'Cadastrar' }}
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbarErro" color="red">{{ mensagemErro }}</v-snackbar>
    <v-snackbar v-model="snackbarSucesso" color="green">{{ mensagemSucesso }}</v-snackbar>
  </v-container>
</template>

<script>
import ChamadoAtendimentoService from '@/services/ChamadoAtendimentoService';
import UsuarioService from '@/services/UsuarioService';
import { format } from 'date-fns';

export default {
  name: 'ChamadoAtendimentoForm',
  data() {
    return {
      valid: false,
      chamado: {
        usuario: null,
        idade: null,
        endereco: '',
        dataAtendimento: new Date(),
      },
      usuarios: [],
      menuData: false,
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
    },
    dataFormatada() {
      return this.chamado.dataAtendimento
        ? format(new Date(this.chamado.dataAtendimento), 'dd/MM/yyyy')
        : '';
    }
  },
  async created() {
    this.usuarios = await UsuarioService.listarUsuarios();
    if (this.id) {
      this.carregarChamado(this.id);
    }
  },
  methods: {
    async carregarChamado(id) {
      try {
        const chamado = await ChamadoAtendimentoService.buscarChamadoPorId(id);
        this.chamado = {
          usuario: chamado.usuario?.id || null,
          idade: chamado.idade,
          endereco: chamado.endereco,
          dataAtendimento: chamado.dataAtendimento || new Date(),
        };
      } catch (error) {
        console.error('Erro ao carregar chamado', error);
        this.mensagemErro = 'Erro ao carregar chamado!';
        this.snackbarErro = true;
      }
    },
    async salvarChamado() {
      if (!this.$refs.form.validate()) {
        this.mensagemErro = 'Preencha todos os campos obrigatórios!';
        this.snackbarErro = true;
        return;
      }

      this.buttonLoading = true;

      const chamadoPayload = {
        usuario: { id: this.chamado.usuario },
        idade: this.chamado.idade,
        endereco: this.chamado.endereco,
        dataAtendimento: this.chamado.dataAtendimento,
      };

      try {
        if (this.id) {
          await ChamadoAtendimentoService.atualizarChamado(this.id, chamadoPayload);
          this.mensagemSucesso = 'Chamado atualizado com sucesso!';
        } else {
          await ChamadoAtendimentoService.criarChamado(chamadoPayload);
          this.mensagemSucesso = 'Chamado criado com sucesso!';
          this.limparFormulario();
        }
        this.snackbarSucesso = true;
      } catch (error) {
        console.error('Erro ao salvar chamado', error);
        this.mensagemErro = 'Erro ao salvar chamado!';
        this.snackbarErro = true;
      } finally {
        this.buttonLoading = false;
      }
    },
    limparFormulario() {
      this.chamado = {
        usuario: null,
        idade: null,
        endereco: '',
        dataAtendimento: new Date(),
      };
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
</style>
