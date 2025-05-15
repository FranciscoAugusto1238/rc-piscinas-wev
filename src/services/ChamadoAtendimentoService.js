import axios from 'axios';

const API_URL = 'http://localhost:8082/chamados';

export default {
  async criarChamado(chamado) {
    try {
      const response = await axios.post(API_URL, chamado);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      throw error;
    }
  },

  async listarChamadosAtivos() {
    try {
      const response = await axios.get(`${API_URL}/ativos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar chamados ativos:', error);
      return [];
    }
  },

  async buscarChamadoPorId(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar chamado por ID (${id}):`, error);
      throw error;
    }
  },

  async finalizarChamado(id) {
    try {
      const response = await axios.put(`${API_URL}/${id}/finalizar`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao finalizar chamado (ID: ${id}):`, error);
      throw error;
    }
  },

  async atualizarChamado(id, chamado) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, chamado);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar chamado (ID: ${id}):`, error);
      throw error;
    }
  }
};
