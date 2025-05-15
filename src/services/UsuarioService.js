import axios from 'axios';

const API_URL = 'http://localhost:8082/usuarios';

export default {
  async criarUsuario(usuario) {
    try {
      const response = await axios.post(API_URL, usuario);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  async listarUsuarios() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  },

  async deletarUsuario(id) {
    try {
      const response = await axios.put(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar usuário (ID: ${id}):`, error);
      throw error;
    }
  },

  async listarUsuariosPorFiltro(nome, cpf) {
    try {
      const params = {};
      if (nome) params.nome = nome;
      if (cpf) params.cpf = cpf;

      const response = await axios.get(`${API_URL}/filtro`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao filtrar usuários:', error);
      return [];
    }
  },

   async buscarUsuarioPorId(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }
};
