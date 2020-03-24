// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { AuthService } from '../../services/Auth';
import AuthHeader from '../common/authHeader';
import Axios from 'axios';
import { withRouter } from 'react-router';

const service = new AuthService();
// eslint-disable-next-line react/prefer-stateless-function
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      email: '',
      password: '',
      confirm_password: '',
      error: null,
      success: null,
    };
    this.handleRegister = this.handleRegister.bind(this);
  }

  async handleRegister() {
    const { email, password, confirm_password, fullname } = this.state;
    if(password.length < 6) {
        this.setState({error: "Password Length must be 6 or above"});
    }else if(password !== confirm_password) {
        this.setState({error: "Password does not match"});
    }else if (fullname && email && password && confirm_password) {
      Axios.all(await service.register(fullname, email, password, confirm_password))
      .then(data => {
        if(data[0].data.status) {
          //redirect to login
          this.setState({ success:'Account Creation was successful' });
          setTimeout(() => {
            this.props.history.push('login');
          }, 1000);
        }
      }).catch(err => {
        this.setState({error: "An error has occured"});
      });
    }
  }

  render() {
    const { error, success } = this.state;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        <AuthHeader page="Login" />
        <ul className="sidenav" id="mobile-demo">
          <li><a href="sass.html">Register</a></li>
        </ul>
        <div className="container">
          <div className="row">
            <form className="offset-s3 col s6">
              <br />
              { (error) ? 
                <div className="error pad"> { error } </div> : '' }
              { (success) ? 
                <div className="success pad"> { success } </div> : '' }
              <div className="row">
                <div className="input-field col s12">
                  <input
                    onChange={e => this.setState({ fullname: e.target.value })}
                    id="fullname"
                    type="text"
                    autoComplete="on"
                    className="validate"
                  />
                  <label htmlFor="fullname">Fullname</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    onChange={e => this.setState({ email: e.target.value })}
                    id="email"
                    type="email"
                    autoComplete="on"
                    className="validate"
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    onChange={e => this.setState({ password: e.target.value })}
                    id="password"
                    type="password"
                    autoComplete="on"
                    className="validate"
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </div>

              <div className="row">
                <div className="input-field col s12">
                  <input
                    onChange={e => this.setState({ confirm_password: e.target.value })}
                    id="confirm_password"
                    autoComplete="on"
                    type="password"
                    className="validate"
                  />
                  <label htmlFor="confirm_password">Password Again</label>
                </div>
              </div>
              <button 
                onClick={ this.handleRegister }
                className="btn waves-effect waves-light blue darken-2"
                type="button"
                name="action">Register</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Register);
