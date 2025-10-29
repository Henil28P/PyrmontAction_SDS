import api from '../../services/api';

const eventServices = {
  getPublishedEvents() {
    return api.get('api/events/published', '');
  },

  getEventById(id) {
    return api.get(`api/events/${id}`, '');
  }
};

export default eventServices;