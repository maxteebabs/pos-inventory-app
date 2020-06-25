/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
}
  from 'react-router-dom';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/reset_password';
import ChangePassword from './components/auth/change_password';

import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import AddProduct from './components/Products/create';
import Product from './components/Products/index';
import User from './components/Users/index';
import Order from './components/Orders/index';
import AddOrder from './components/Orders/create';
import ViewOrder from './components/Orders/view';


// @ts-ignore
// import { createHistory, useBasename } from 'history';

import './App.css';
// import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

// @ts-ignore
// const history = useBasename(createHistory)({
//   basename: '/'
// })  
class App extends React.Component {
  render() {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <Router>
        <div>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route exact path="/index.html" render={() => <Redirect to="/dashboard" />} />
            <Route exact path="/login" render={() => <Login />} />
            <Route exact path="/register" render={() => <Register />} />
            <Route
              exact
              path="/reset/password"
              render={() => <ResetPassword />}
            />
            <Route
              exact
              path="/change/password/:token"
              render={() => <ChangePassword />}
            />

            <Route exact path="/dashboard" render={() => <Dashboard />} />
            <Route exact path="/product/add" render={() => <AddProduct />} />
            <Route
              exact
              path="/product/edit/:id"
              render={() => <AddProduct />}
            />
            <Route exact path="/product" render={() => <Product />} />
            <Route exact path="/logout" render={() => <Login />} />

            <Route exact path="/orders" render={() => <Order />} />
            <Route exact path="/order/add" render={() => <AddOrder />} />
            <Route exact path="/order/view/:id" render={() => <ViewOrder />} />
            <Route exact path="/users" render={() => <User />} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
