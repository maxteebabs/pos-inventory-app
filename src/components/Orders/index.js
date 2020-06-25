// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { OrderService } from '../../services/Order';
import Header from '../common/Header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import 'toastr/build/toastr.min.css';
import Axios from 'axios';
import {} from '../../models/Order';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import moment from 'moment';

const service = new OrderService();
// eslint-disable-next-line react/prefer-stateless-function
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      error: null,
      orders: [],
      page: 1,
      total_pages: null,
      total_rows: null,
      search: ""
    };
    this.getOrders = this.getOrders.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount() {
    this.getOrders(this.state.page);
  }
  async getOrders(page) {
    Axios.all(await service.getAll(this.props.token, page))
      .then(data => {
        if (data[0].status === 405) {
          this.setState({ error: "Unauthenticated User" });
          setTimeout(() => {
            localStorage.clear();
            this.props.history.push("/login");
          }, 1000);
        }
        if (data[0].status === 200) {
          this.setState({ orders: data[0].data.orders });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "Failed to retrieve orders." });
      });
  }
  async handleSearch() {
    let { search, page } = this.state;
    Axios.all(await service.search(this.props.token, { page, search }))
      .then(data => {
        if (data[0].status === 405) {
          this.setState({ error: "Failed to retrieve searched orders" });
        }
        if (data[0].status === 200) {
          let result = data[0].data;
          this.setState({
            orders: result.orders,
            page: result.page,
            total_rows: result.total_rows,
            total_pages: result.total_pages
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ error: "Failed to retrieve orders." });
      });
  }
  displayDate(d) {
    let formattedDate = moment(d).format("YYYY-MM-DD HH:mm:ss");
    return formattedDate;
  }
  format(number, n, x) {
    var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
  }
  changePage(page) {
    if (page < 1) {
      page = 1;
    } else if (this.state.total_pages && page > this.state.total_pages) {
      page = this.state.total_pages;
    }
    this.setState({ page });
    if (this.search) {
      this.handleSearch();
    } else {
      this.getOrders(page);
    }
  }
  async confirmDelete(id, index) {
    var c = window.confirm("Are you sure you want to delete this item?");
    if(c) {
        let resp = await service.delete(id, this.props.token);
        if(resp.status === 200) {
          toastr.success(resp.data.msg);
          //we need to pop it out
          let { orders } = this.state;
          orders.splice(index, 1);
          this.setState({orders});
        }
    }
    return false;
  }
  render() {
    let { orders, error, page } = this.state;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        <Header />
        <div className="container">
          <center>
            <h4>Orders</h4>
          </center>
          {error ? <div className="error pad"> {error} </div> : ""}
          <div>
            <Link className="btn blue" to="/dashboard">
              Back
            </Link>
            <span style={{ textAlign: "right", float: "right" }}>
              <Link to={{ pathname: `/order/add/` }} className="btn blue">
                Create
              </Link>
            </span>
          </div>
          {this.state.orders.length > 20 &&
          <ul className="">
            <li className="waves-effect page-links">
              <a href="#!" onClick={() => this.changePage(--page)} title="prev">
                &laquo;
              </a>
            </li>
            <li className="waves-effect page-links">
              <a href="#!" onClick={() => this.changePage(++page)} title="next">
                &raquo;
              </a>
            </li>
          </ul>
          }

          <table className="striped responsive-table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Order ID</th>
                <th>Total</th>
                <th>Net Total</th>
                <th>Created By</th>
                <th>Date Entered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                return (
                  <tr className="products" key={index}>
                    <td>{index + 1}</td>
                    <td>{order.orderID}</td>
                    <td>{this.format(order.total, 2)}</td>
                    <td>{this.format(order.netTotal)}</td>
                    <td>{order.created_by.email}</td>
                    <td>{this.displayDate(order.date_entered)}</td>
                    <td>
                      <Link
                        to={{ pathname: `/order/view/${order._id}` }}
                        className=""
                      >
                        View
                      </Link>
                      {" "}
                      {this.props.isAdmin &&
                      <a
                        href="#"
                        className="delBtn"
                        onClick={() => this.confirmDelete(order._id, index)}
                      >
                        Delete
                      </a>}
                      {/* <Link to={{pathname:`/order/edit/${order._id}`}}
                            className="">Edit</Link>  */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});
export default connect(mapStateToProps, null)(withRouter(Order));
