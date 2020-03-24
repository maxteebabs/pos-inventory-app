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
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      error: null,
      loading:false
    };
    this.handleReset = this.handleReset.bind(this);
  }

  async handleReset(e) {
    e.preventDefault();
    const { email } = this.state;
    this.setState({error: null, loading: true});
    if (email) {
        let resp = await service.reset(email);
        if(resp && resp.status === 200) {
          toastr.success(resp.data.msg);  
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
        <AuthHeader page="Reset" />
        <ul className="sidenav" id="mobile-demo">
          <li><a href="sass.html">Reset Password</a></li>
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
                    autoComplete="on"
                    type="email"
                    className="validate"
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <button onClick={ this.handleReset } 
                className="btn waves-effect waves-light blue darken-2" type="button" name="action">
                  Reset</button>
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
export default connect(null, mapDispatchToProps)(withRouter(ResetPassword));
