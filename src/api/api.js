import Request from './Request';
import Contacts from 'react-native-contacts';

/**
 * Class that exposes REST API endpoints
 */
class Api {
  constructor() {
    this.request = new Request();
  }

  /**
   * Get list of trending repositories for a given date
   */
  getTrendingRepo(date) {
    const params = {
      q: `created:${date}`,
      sort: 'stars',
      order: 'desc'
    };

    return this.request.get('/search/repositories', params, undefined);
  }

  getAllContacts() {
    return new Promise((resolve, reject) => {
      Contacts.getAll((err, contacts) => {
        if (err) {
          reject(err)
        }
        resolve(contacts)
      })
    })
  }
}

export default api = new Api();
