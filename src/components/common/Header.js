// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prefer-stateless-function
class Header extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      token: null,
    };
    this.handleLogout = this.handleLogout.bind(this);
  }
  componentDidMount() {
    if(!this.props.reducer.token) {
      this.props.history.push('login');
    }
  }
  
  handleLogout() {
    localStorage.clear();
    this.props.history.push('/login');
  }
  render() {
    let fullname = this.props.reducer.fullname;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
        <nav>
          <div className="nav-wrapper  blue darken-2">
            <Link to="/dashboard" className="brand-logo">Point of Sale</Link>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="#">{ fullname }</a></li>
              <li>
                  <a href="#" onClick={ this.handleLogout }>Log out</a>
              </li>
            </ul>
          </div>
        </nav>
    );
  }
}
const mapStateToProps = state => ({
  reducer: state
});
export default connect(mapStateToProps, null)(withRouter(Header));
