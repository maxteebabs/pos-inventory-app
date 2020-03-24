// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prefer-stateless-function
class AuthHeader extends Component {
  constructor(props) {
    super(props);
    this.page = this.props.page;
  }
  render() {
    let pageLinks = null;
    if(this.page === 'Login') {
      pageLinks = <li><Link to="/login">{ this.page }</Link></li>;
    }else if(this.page === 'Register') {
      pageLinks = <li><Link to="/register">{ this.page }</Link></li>;
    }else{
      pageLinks = ( <><li><Link to="/login">Login</Link></li><li><Link to="/register"> Register</Link></li></>);
    }
    return (
      // eslint-disable-next-line react/jsx-filename-extension
        <nav>
          <div className="nav-wrapper  blue darken-2">
            <a href="#" className="brand-logo">Point of Sale</a>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
                {pageLinks}
            </ul>
          </div>
        </nav>
    );
  }
}
export default AuthHeader;
