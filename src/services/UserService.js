import Axios from 'axios';
import appConfig from '../config';

// eslint-disable-next-line import/prefer-default-export
export class UserService {
  // eslint-disable-next-line class-methods-use-this
//   create(product, token) {
//     const axios = Axios.create({
//       baseURL: appConfig.getUrl('product/store'),
//     });
//     var headers = {
//       'Content-Type': 'application/json',
//       'x-access-token': token,
//     };

//     return axios.post('/', product, { headers: headers })
//       .then(res => {
//         let product = res.data.product;
//         let result = [{
//           product: new Product(product),
//           status: res.status
//         }];
//         return result;
//       }).catch(err => {
//         return [err.response];  
//       });
//   }
  
  getAll(token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('users'),
    });
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.get('/', { headers: headers })
      .then(res => {
        return [res];
      }).catch(err => {
        return [err.response];  
      });
  }
  
  delete(id, token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl(`user/delete/${id}`),
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
