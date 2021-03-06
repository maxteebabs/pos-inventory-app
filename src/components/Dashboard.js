// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Header from './common/Header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { AddBox, List, AddShoppingCart, People, ShoppingCart } from "@material-ui/icons";
// import Axios from 'axios';
// import { AuthService } from '../services/Auth';
// let service = new AuthService();


// eslint-disable-next-line react/prefer-stateless-function
class Dashboard extends Component {
  // constructor(props) {
  //   super(props);
  //   let user = "";

  // }
  componentDidMount() {
    // this.validateToken();
  }
  // async validateToken() {
  //   //verify token with server
  //   Axios.all( await service.validateToken(this.props.reducer.token)).then(res => {
  //     console.log(res);
  //   }).catch(err => {
  //     this.props.history.push('login');
  //   });
  // }
  
  render() {
      return (
        <div>
          <Header />
          <div className="container">
            <div className="section">
              <div className="row">
                <div className="col s12 m4">
                  <div className="card-panel pos-card card-1">
                    <Link to="product/add">
                      <AddBox style={{ fontSize: 120 }} />
                      <p className="white-text">Add Product</p>
                    </Link>
                  </div>
                </div>
                <div className="col s12 m4">
                  <div className="card-panel pos-card card-2">
                    <Link to="product">
                      <List style={{ fontSize: 120 }} />
                      <p className="white-text">List Products</p>
                    </Link>
                  </div>
                </div>
                <div className="col s12 m4">
                  <div className="card-panel pos-card card-3">
                    <Link to="order/add">
                      <AddShoppingCart style={{ fontSize: 120 }} />
                      <p className="white-text">New Order</p>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12 m4">
                  <div className="card-panel pos-card card-5">
                    <Link to="users">
                      <People style={{ fontSize: 120 }} />
                      <p className="white-text">Users</p>
                    </Link>
                  </div>
                </div>
                <div className="col s12 m4">
                  <div className="card-panel pos-card card-4">
                    <Link to="orders">
                      <ShoppingCart style={{ fontSize: 120 }} />
                      <p className="white-text">Orders</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

const mapStateToProps = state => ({
  ...state
});
export default connect(mapStateToProps, null)(withRouter(Dashboard));
