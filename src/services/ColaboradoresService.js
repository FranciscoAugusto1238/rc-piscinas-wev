import axios from 'axios';

const API_URL = 'http://localhost:8082/colaboradores';

export default {
  async criarColaborador(colaborador) {
    try {
      const response = await axios.post(API_URL, colaborador);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      throw error;
    }
  },

  async listarColaboradores() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar colaboradores:', error);
      return [];
    }
  },

  async deletarColaborador(id) {
    try {
      const response = await axios.put(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar colaborador (ID: ${id}):`, error);
      throw error;
    }
  },

  async listarColaboradoresPorFiltro(nome, cpf) {
    try {
      const params = {};
      if (nome) params.nome = nome;
      if (cpf) params.cpf = cpf;

      const response = await axios.get(`${API_URL}/filtro`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar colaboradores por filtro:', error);
      return [];
    }
  },

  buscarColaboradorPorId(id) {
    return axios.get(`${API_URL}/${id}`).then(res => res.data);
  },
};
