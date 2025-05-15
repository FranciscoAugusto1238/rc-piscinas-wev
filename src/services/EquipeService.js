import axios from 'axios';

const API_URL = 'http://localhost:8082/equipes';

export default {
  async criarEquipe(equipe) {
    try {
      const response = await axios.post(API_URL, equipe);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      throw error;
    }
  },

  async listarEquipesAtivas() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar equipes ativas:', error);
      return [];
    }
  },

  async buscarEquipePorId(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar equipe por ID (${id}):`, error);
      throw error;
    }
  },

  async atualizarEquipe(id, equipe) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, equipe);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar equipe (ID: ${id}):`, error);
      throw error;
    }
  },

  async desativarEquipe(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao desativar equipe (ID: ${id}):`, error);
      throw error;
    }
  }
};
