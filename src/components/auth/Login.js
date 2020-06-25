// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { AuthService } from '../../services/Auth';
import AuthHeader from '../common/authHeader';
import { setUser } from '../../redux/action';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Axios from 'axios';

const service = new AuthService();
// eslint-disable-next-line react/prefer-stateless-function
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  async handleLogin(e) {
    e.preventDefault();
    const { email, password } = this.state;
    this.setState({error: null});
    if (email && password) {
      Axios.all(await service.login(email, password)).then(data => {
        if(data[0].user.token) {
          let user = data[0].user;
          //set state in redux
          this.props.setUser(user);
          this.props.history.push('dashboard');
        }
      }).catch(err => {
        this.setState({error: "Incorrect email/password combination."});
      });
    }
  }

  render() {
    const error = this.state.error;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        <AuthHeader page="Register" />
        <ul className="sidenav" id="mobile-demo">
          <li><a href="sass.html">Register</a></li>
        </ul>
        <div className="container">
          <div className="row">
            <form className="offset-s3 col s6">
              <br />
              { (error) ? 
                <div className="error pad"> { error } </div> : '' }
              <div className="row">
                <div className="input-field col s12">
                  <input
                    onChange={e => this.setState({ email: e.target.value })}
                    id="email"
                    name="email"
                    autoComplete="on"
                    type="email"
                    className="validate"
                  />
                  <label className="active" htmlFor="email">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    onChange={e => this.setState({ password: e.target.value })}
                    id="password"
                    autoComplete="on"
                    type="password"
                    name="password"
                    className="validate"
                  />
                  <label className="active" htmlFor="password">Password</label>
                </div>
              </div>
              <button onClick={ this.handleLogin } className="btn waves-effect waves-light blue darken-2" type="button" name="action">Login</button>
              <Link to="/reset/password" className=""> Reset password</Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setUser: (user) => dispatch(setUser(user)),
});
//  const mapDispatchToProps = (dispatch) => {
//   return {
//     onTodoClick: (id) => {
//       dispatch(toggleTodo(id))
//     }
//   }
// }
// const mapStateToProps = (state) => {
//   return {
//     todos: getVisibleTodos(state.todos, state.visibilityFilter)
//   }
// }

export default connect(null, mapDispatchToProps)(withRouter(Login));
