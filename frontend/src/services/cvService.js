import api from './api';

export const cvService = {
  async getUserCVs() {
    const res = await api.get('/cvs');
    return res.data;
  },

  async createCV(data) {
    const res = await api.post('/cvs', data);
    return res.data;
  },

  async getCVById(id) {
    const res = await api.get(`/cvs/${id}`);
    return res.data;
  },

  async updateCV(id, data) {
    const res = await api.put(`/cvs/${id}`, data);
    return res.data;
  },

  async updateTemplate(id, template_id) {
    const res = await api.patch(`/cvs/${id}/template`, { template_id });
    return res.data;
  },

  async deleteCV(id) {
    const res = await api.delete(`/cvs/${id}`);
    return res.data;
  },

  async getTemplates() {
    const res = await api.get('/templates');
    return res.data;
  },

  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  }
};
