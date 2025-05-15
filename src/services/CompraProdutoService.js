import axios from 'axios';

const API_URL = 'http://localhost:8082/compra-produto';

export default {
  async adicionarProduto(produto) {
    try {
      const response = await axios.post(API_URL, produto);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar produto à compra:', error);
      throw error;
    }
  },

  async listarPorCompra(compraId) {
    try {
      const response = await axios.get(`${API_URL}/compra/${compraId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao listar produtos da compra ID ${compraId}:`, error);
      return [];
    }
  },

  async removerProduto(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Erro ao remover produto da compra ID ${id}:`, error);
      throw error;
    }
  },

  async atualizarProduto(id, produto) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, produto);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto da compra ID ${id}:`, error);
      throw error;
    }
  }
};
