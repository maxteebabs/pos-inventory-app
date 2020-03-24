import Axios from 'axios';
import appConfig from '../config';
import { User } from '../models/User';

// eslint-disable-next-line import/prefer-default-export
export class AuthService {
  // eslint-disable-next-line class-methods-use-this
  login(email, password) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('login'),
    });
    var headers = {
      'Content-Type': 'application/json',
    }
    const params = {
      email,
      password,
    };

    return axios.post('/', params, { headers: headers })
      .then(res => {
        let user = res.data.user;
        user.token = res.data.token;
        let result = [{
          user: new User(user)
        }];
        return result;
      }).catch(err => err);
  }

  register(fullname, email, password, confirm_password) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('register'),
    });
 
    var headers = {
      'Content-Type': 'application/json',
    };
    let params = {
      fullname,
      email,
      password,
      confirm_password,
    }

    return axios.post('/', params, {headers: headers})
      .then(res => {
        return [res];
      }).catch(err => err);
  }
  reset(email) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('forgot/password'),
    });
    var headers = {
      'Content-Type': 'application/json',
    }
    const params = {
      email
    };

    return axios.post('/', params, { headers: headers })
      .then(res => {
        return res;
      }).catch(err => err.response);
  }
  changePassword(token, password, confirm_password) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('change/password'),
    });
    var headers = {
      'Content-Type': 'application/json',
    }
    const params = {
      password,
      confirm_password,
      token
    };

    return axios.post('/', params, { headers: headers })
      .then(res => {
        return res;
      }).catch(err => err.response);
  }
  validateToken(token) {
    const axios = Axios.create({
      baseURL: appConfig.getUrl('token'),
    });
 
    var headers = {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };

    return axios.get('/', {headers: headers})
      .then(res => {
        return [res];
      }).catch(err => err);
  }
}
