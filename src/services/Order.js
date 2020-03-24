import Axios from 'axios';
import appConfig from '../config';

// eslint-disable-next-line import/prefer-default-export
export class OrderService {
  // eslint-disable-next-line class-methods-use-this
  create(order, token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('order/store'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.post('/', order, { headers: headers })
      .then(res => {
        return [res];
      }).catch(err => {
        return [err.response];  
      });
  }
  getAll(token, page = '') {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('orders'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios
      .get(`/?page=${page}`, { headers: headers })
      .then(res => {
        return [res];
      })
      .catch(err => {
        return [err.response];
      });
  }
  search(token, params) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('orders'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.post(`/search?page=${params.page}`
      , {search:params.search}, { headers: headers })
      .then(res => {
        return [res];
      }).catch(err => {
        return [err.response];  
      });
  }
  get(token, id) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('order'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.get(`/find/${id}`, { headers: headers })
    .then(res => {
      return [res];
    }).catch(err => {
      return [err.response];  
    });
  }
}
