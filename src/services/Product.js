import Axios from 'axios';
import appConfig from '../config';
import { Product } from '../models/Product';

// eslint-disable-next-line import/prefer-default-export
export class ProductService {
  // eslint-disable-next-line class-methods-use-this
  create(product, token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('product/store'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.post('/', product, { headers: headers })
      .then(res => {
        let product = res.data.product;
        let result = [{
          product: new Product(product),
          status: res.status
        }];
        return result;
      }).catch(err => {
        return [err.response];  
      });
  }
  update(product, token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl(`product/update/${product._id}`),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.patch('/', product, { headers: headers })
      .then(res => {
        let product = res.data.product;
        let result = [{
          product: new Product(product),
          status: res.status
        }];
        return result;
      }).catch(err => {
        return [err.response];  
      });
  }
  getAll(token, page = 1) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('products'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.get(`/?page=${page}`, { headers: headers })
      .then(res => {
        return [res];
      }).catch(err => {
        return [err.response];  
      });
  }
  search(token, params) {
    console.log(token)
    const axios = Axios.create({
      baseURL: appConfig.getUrl('products'),
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
  getProductOptions(token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('products'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.get('/options', { headers: headers })
      .then(res => {
        return [res];
      }).catch(err => {
        return [err.response];  
      });
  }
  get(token, id) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('product'),
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
  delete(id, token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl(`product/delete/${id}`),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };
    return axios.delete('/', { headers: headers })
    .then(res => {
      return res;
    }).catch(err => {
      return err.response;  
    });
  }
}
