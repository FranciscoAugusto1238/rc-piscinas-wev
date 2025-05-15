<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        class="d-flex justify-center align-center"
        style="height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        <v-card
          max-width="420"
          class="pa-6"
          elevation="12"
          rounded
          color="white"
          style="border-radius: 16px;"
        >
          <v-row justify="center" class="mb-4">
            <v-avatar size="64" class="blue--text">
              <v-icon large>mdi-account-circle</v-icon>
            </v-avatar>
          </v-row>

          <v-card-title class="headline font-weight-bold justify-center">
            Acesse sua Conta
          </v-card-title>

          <v-card-subtitle class="text-center mb-6 grey--text">
            Informe seu CPF e senha para continuar
          </v-card-subtitle>

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="cpf"
              label="CPF"
              :rules="cpfRules"
              required
              prepend-inner-icon="mdi-account"
              clearable
              autofocus
              outlined
              dense
            ></v-text-field>

            <v-text-field
              v-model="senha"
              label="Senha"
              :rules="senhaRules"
              type="password"
              required
              prepend-inner-icon="mdi-lock"
              clearable
              outlined
              dense
              @keyup.enter="fazerLogin"
            ></v-text-field>

            <v-alert
              v-if="erro"
              type="error"
              dense
              class="mt-3"
              border="left"
              colored-border
              elevation="2"
            >
              {{ mensagemErro }}
            </v-alert>

            <v-btn
              color="deep-purple accent-4"
              class="mt-6"
              block
              large
              :disabled="!valid"
              @click="fazerLogin"
              elevation="6"
            >
              Entrar
            </v-btn>

            <!-- Botão para cadastrar usuário -->
            <v-btn
              color="grey lighten-1"
              class="mt-3"
              block
              large
              outlined
              @click="irParaCadastro"
            >
              Cadastrar Usuário
            </v-btn>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UsuarioService from '@/services/UsuarioService';

export default {
  data() {
    return {
      cpf: '',
      senha: '',
      valid: false,
      erro: false,
      mensagemErro: '',
      cpfRules: [
        v => !!v || 'CPF é obrigatório',
        v => /^[0-9]{11}$/.test(v.replace(/\D/g, '')) || 'Digite um CPF válido com 11 números',
      ],
      senhaRules: [v => !!v || 'Senha é obrigatória'],
    };
  },
  methods: {
    async fazerLogin() {
      if (!this.$refs.form.validate()) return;

      try {
        const usuarios = await UsuarioService.listarUsuarios();
        const cpfInput = this.cpf.replace(/\D/g, '');

        const encontrado = usuarios.find(
          u => String(u.cpf) === cpfInput && u.senha === this.senha
        );

        console.log('Usuário encontrado:', encontrado);

        if (encontrado) {
          localStorage.setItem('usuarioLogado', JSON.stringify(encontrado));
          this.erro = false;
          this.$router.push({ name: 'Home' });
        } else {
          this.erro = true;
          this.mensagemErro = 'Usuário ou senha inválidos';
        }
      } catch (err) {
        this.erro = true;
        this.mensagemErro = 'Erro ao tentar fazer login';
      }
    },

    irParaCadastro() {
      this.$router.push({ name: 'CadastrarUsuario' });
    },
  },
};
</script>
