<template>
  <a-container>
    <v-form ref="form" v-model="valid" lazy-validation>
      <h2 style="margin-left: 0;">{{ id ? 'Editar Usuário' : 'Cadastro de Usuário' }}</h2>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.nome"
            label="Nome"
            :rules="[v => !!v || 'Nome é obrigatório']"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.cpf"
            label="CPF"
            type="number"
            :rules="[v => !!v || 'CPF é obrigatório']"
            required
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="usuario.uf"
            label="UF"
            :rules="[v => !!v || 'UF é obrigatória']"
            maxlength="2"
            required
          />
        </v-col>

        <v-col cols="12" md="8">
          <v-text-field
            v-model="usuario.municipio"
            label="Município"
            :rules="[v => !!v || 'Município é obrigatório']"
            required
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="usuario.senha"
            label="Senha"
            type="password"
            :rules="senhaRules"
            :required="!id"
            placeholder="Deixe vazio para não alterar"
          />
        </v-col>

        <v-col cols="12" md="6" v-if="isAdmin">
          <v-select
            v-model="usuario.permissao"
            :items="permissoes"
            label="Permissão"
            :rules="[v => !!v || 'Permissão é obrigatória']"
            required
          />
        </v-col>

        <v-col cols="12" md="6" v-else>
          <v-text-field label="Permissão" :value="usuario.permissao" readonly />
        </v-col>

        <v-col cols="12" md="6">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="usuario.dataNascimento"
                label="Data de Nascimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="[v => !!v || 'Data de nascimento é obrigatória']"
                required
              />
            </template>
            <v-date-picker v-model="usuario.dataNascimento" no-title @input="menu = false" />
          </v-menu>
        </v-col>
      </v-row>
    </v-form>

    <a-container>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn @click="salvarUsuario" :loading="buttonLoading" color="#388E3C" class="white--text">
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
import UsuarioService from '@/services/UsuarioService';

export default {
  name: 'CadastroUsuario',
  data() {
    return {
      valid: false,
      menu: false,
      usuario: {
        nome: '',
        cpf: '',
        uf: '',
        municipio: '',
        senha: '',
        permissao: 'USER', // padrão para não admins
        dataNascimento: null,
      },
      permissoes: ['ADMIN', 'USER', 'VISITOR'],
      buttonLoading: false,
      mensagemErro: '',
      mensagemSucesso: '',
      snackbarErro: false,
      snackbarSucesso: false,
      senhaRules: [
        v => (this.$route.params.id || v) ? true : 'Senha é obrigatória'
      ],
      isAdmin: false,
    };
  },
  computed: {
    id() {
      return this.$route.params.id || null;
    }
  },
  created() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    this.isAdmin = usuarioLogado && usuarioLogado.permissao === 'ADMIN';

    if (this.id) {
      this.carregarUsuario(this.id);
    } else if (!this.isAdmin) {
      this.usuario.permissao = 'USER';
    }
  },
  watch: {
    '$route.params.id'(newId) {
      if (newId) {
        this.carregarUsuario(newId);
      } else {
        this.limparFormulario();
        if (!this.isAdmin) {
          this.usuario.permissao = 'USER';
        }
      }
    }
  },
  methods: {
    async carregarUsuario(id) {
      try {
        const usuario = await UsuarioService.buscarUsuarioPorId(id);
        this.usuario = {
          nome: usuario.nome,
          cpf: usuario.cpf,
          uf: usuario.uf,
          municipio: usuario.municipio,
          senha: '',
          permissao: usuario.permissao,
          dataNascimento: usuario.dataNascimento,
        };
      } catch (error) {
        console.error('Erro ao carregar usuário', error);
      }
    },

    async salvarUsuario() {
      if (!this.$refs.form.validate()) {
        this.mensagemErro = 'Preencha todos os campos obrigatórios!';
        this.snackbarErro = true;
        return;
      }

      this.buttonLoading = true;

      try {
        if (this.usuario.dataNascimento instanceof Date) {
          this.usuario.dataNascimento = this.usuario.dataNascimento.toISOString().substr(0, 10);
        }

        if (!this.isAdmin) {
          this.usuario.permissao = 'USER';
        }

        if (this.id) {
          const usuarioAtualizado = { ...this.usuario };
          if (!usuarioAtualizado.senha) delete usuarioAtualizado.senha;
          await UsuarioService.atualizarUsuario(this.id, usuarioAtualizado);
          this.mensagemSucesso = 'Usuário atualizado com sucesso!';
        } else {
          await UsuarioService.criarUsuario(this.usuario);
          this.mensagemSucesso = 'Usuário cadastrado com sucesso!';
          this.limparFormulario();
        }

        this.snackbarSucesso = true;
      } catch (error) {
        console.error('Erro ao salvar usuário', error);
        this.mensagemErro = 'Erro ao salvar usuário! Tente novamente.';
        this.snackbarErro = true;
      } finally {
        this.buttonLoading = false;
      }
    },

    limparFormulario() {
      this.usuario = {
        nome: '',
        cpf: '',
        uf: '',
        municipio: '',
        senha: '',
        permissao: this.isAdmin ? null : 'USER',
        dataNascimento: null,
      };
      this.$refs.form.resetValidation();
    },
  },
};
</script>
