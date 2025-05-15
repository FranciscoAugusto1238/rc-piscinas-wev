<template>
    <v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
            <h2 style="margin-left: 0;">{{ id ? 'Editar Colaborador' : 'Cadastro de Colaborador' }}</h2>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="colaborador.nome" label="Nome" :rules="[v => !!v || 'Nome é obrigatório']"
                        required />
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="colaborador.telefone" label="Telefone"
                        :rules="[v => !!v || 'Telefone é obrigatório']" required type="tel" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field v-model="colaborador.cpf" label="CPF" :rules="[v => !!v || 'CPF é obrigatório']"
                        required />
                </v-col>
                <v-col cols="12" md="6">
                    <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition"
                        offset-y min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="colaborador.dataNascimento" label="Data de Nascimento"
                                prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
                                :rules="[v => !!v || 'Data de nascimento é obrigatória']" required />
                        </template>
                        <v-date-picker v-model="colaborador.dataNascimento" no-title @input="menu = false" />
                    </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select v-model="colaborador.equipe" :items="equipes" item-text="nome" item-value="id"
                        label="Equipe" :rules="[v => !!v || 'Equipe é obrigatória']" required />
                </v-col>
            </v-row>
        </v-form>
        <v-container>
            <v-row justify="center">
                <v-col cols="auto">
                    <v-btn @click="salvarColaborador" :loading="buttonLoading" color="#388E3C" class="white--text">
                        {{ id ? 'Atualizar' : 'Cadastrar' }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-snackbar v-model="snackbarErro" color="red">{{ mensagemErro }}</v-snackbar>
        <v-snackbar v-model="snackbarSucesso" color="green">{{ mensagemSucesso }}</v-snackbar>
    </v-container>
</template>

<script>
import ColaboradorService from '@/services/ColaboradoresService';
import EquipeService from '@/services/EquipeService';

export default {
    name: "CadastrarColaborador",
    data() {
        return {
            valid: false,
            menu: false,
            colaborador: {
                nome: "",
                telefone: "",
                cpf: "",
                dataNascimento: null,
                equipe: null,
            },
            equipes: [],
            buttonLoading: false,
            mensagemErro: "",
            mensagemSucesso: "",
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
        await this.carregarEquipes();
        if (this.id) {
            await this.carregarColaborador(this.id);
        }
    },
    watch: {
        '$route.params.id': async function (newId) {
            if (newId) {
                await this.carregarColaborador(newId);
            } else {
                this.limparFormulario();
            }
        }
    },
    methods: {
        async carregarEquipes() {
      try {
        this.equipes = await EquipeService.listarEquipesAtivas();
      } catch (error) {
        console.error("Erro ao carregar equipes", error);
        this.equipes = [];
      }
    },

        async carregarColaborador(id) {
            try {
                const colaborador = await ColaboradorService.buscarColaboradorPorId(id);
                this.colaborador = {
                    nome: colaborador.nome,
                    telefone: colaborador.telefone,
                    cpf: colaborador.cpf,
                    dataNascimento: colaborador.dataNascimento,
                    equipe: colaborador.equipe || null
                };
            } catch (error) {
                console.error("Erro ao carregar colaborador", error);
                this.mensagemErro = "Erro ao carregar colaborador!";
                this.snackbarErro = true;
            }
        },

        async salvarColaborador() {
            if (!this.$refs.form.validate()) {
                this.mensagemErro = "Preencha todos os campos obrigatórios!";
                this.snackbarErro = true;
                return;
            }

            this.buttonLoading = true;

            try {
                const payload = {
                    ...this.colaborador,
                    dataNascimento:
                        this.colaborador.dataNascimento instanceof Date
                            ? this.colaborador.dataNascimento.toISOString().substr(0, 10)
                            : this.colaborador.dataNascimento,
                    equipe: { id: this.colaborador.equipe }
                };

                if (this.id) {
                    await ColaboradorService.atualizarColaborador(this.id, payload);
                    this.mensagemSucesso = "Colaborador atualizado com sucesso!";
                } else {
                    await ColaboradorService.criarColaborador(payload);
                    this.mensagemSucesso = "Colaborador cadastrado com sucesso!";
                    this.limparFormulario();
                }

                this.snackbarSucesso = true;
            } catch (error) {
                console.error("Erro ao salvar colaborador", error);
                this.mensagemErro = "Erro ao salvar colaborador! Tente novamente.";
                this.snackbarErro = true;
            } finally {
                this.buttonLoading = false;
            }
        },

        limparFormulario() {
            this.colaborador = {
                nome: "",
                telefone: "",
                cpf: "",
                dataNascimento: null,
                equipe: null
            };
            this.$refs.form.resetValidation();
        },
    },
};
</script>
