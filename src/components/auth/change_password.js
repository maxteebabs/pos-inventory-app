// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { AuthService } from '../../services/Auth';
import AuthHeader from '../common/authHeader';
import { setUser } from '../../redux/action';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import toastr from 'toastr';

const service = new AuthService();
// eslint-disable-next-line react/prefer-stateless-function
class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm_password: '',
      error: null,
      token: "",
      loading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    if(params.token) {
        this.setState({token: params.token});
    }
  }
  async handleSubmit(e) {
    e.preventDefault();
    const { token, confirm_password, password } = this.state;
    this.setState({error: null});
    if(password !== confirm_password) {
        this.setState({error: "Password does not match"});return;
    }
    if(!token) {
      this.setState({ error: "Invalid token" }); return;
    }
    if (confirm_password && password && token) {
        this.setState({ loading: true });
        let resp = await service.changePassword(token,password, confirm_password);
        if(resp.status === 200) {
            toastr.success(resp.data.msg);
            //redirect to login
            setTimeout(() => {
              this.props.history.push('/login');
            }, 1000);
        }else {
            this.setState({error: resp.data.error});
            toastr.error(resp.data.error);
        }
        this.setState({ loading: false });
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
                        onChange={e => this.setState({ password: e.target.value })}
                        id="password"
                        autoComplete="on"
                        type="password"
                        className="validate"
                    />
                    <label className="active" htmlFor="password">Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                    <input
                        onChange={e => this.setState({ confirm_password: e.target.value })}
                        id="cpassword"
                        autoComplete="on"
                        type="password"
                        className="validate"
                    />
                    <label className="active" htmlFor="cpassword">Confirm Password</label>
                    </div>
                </div>
              <button onClick={ this.handleSubmit } 
                className="btn waves-effect waves-light blue darken-2" 
                type="button" name="action">Change Password</button>
              {(this.state.loading) ? <span className="loading" >loading...</span> : null}
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
export default connect(null, mapDispatchToProps)(withRouter(ChangePassword));
