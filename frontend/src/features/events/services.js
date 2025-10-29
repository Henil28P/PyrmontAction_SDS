import axios from 'axios';

const API_URL = 'http://localhost:5000/api/events';

export default {
  // Get all published events (public access)
  async getPublishedEvents() {
    try {
      const response = await axios.get(`${API_URL}/published`);
      return response.data;
    } catch (error) {
      console.error('Error fetching published events:', error);
      throw error;
    }
  },

  // Get single event by ID (public access)
  async getEventById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }
}
