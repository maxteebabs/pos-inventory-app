// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { OrderService } from '../../services/Order';
import Header from '../common/Header';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import 'toastr/build/toastr.min.css';
import Axios from 'axios';
import {} from '../../models/Order';
import moment from 'moment';

const service = new OrderService();
// eslint-disable-next-line react/prefer-stateless-function
class ViewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      orderID: '',
      customer_name: '',
      total: 0,
      netTotal: 0,
      vat: 5,
      created_by: '',
      email: '',
      date_entered: '',
      error: null,
      items: [],
    };
    this.getOrder = this.getOrder.bind(this);
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    if(params.id) {
      this.getOrder(params.id);
    }
  }
  async getOrder(id) {
    Axios.all(await service.get(this.props.token, id)).then(data => {
      if(data[0].status === 405) {
        this.setState({error: "Unauthenticated User"});
        setTimeout(() => {
          localStorage.clear();
          this.props.history.push('/login');
        }, 1000);
      }
      if(data[0].status === 200) {
          let order = data[0].data.order;
          let items = data[0].data.items;
          this.setState({_id: order._id});
          this.setState({email: order.created_by.email});
          this.setState({date_entered: order.date_entered});
          this.setState({netTotal: order.netTotal});
          this.setState({total: order.total});
          this.setState({orderID: order.orderID});
          this.setState({items});      
      }
    }).catch(err => {
        console.log(err);
        this.setState({error: 'Failed to retrieve order.' });
    });
}
  displayDate(d) {
      let formattedDate = moment(d).format('YYYY-MM-DD');
      return formattedDate;
  }
  format(number, n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  }
  render() {
    let { error, orderID, email, date_entered, items, total } = this.state;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        <Header />
        <div className="container">
          <center><h4>Order Reference ID: {orderID}</h4></center>
          { (error) ? 
                <div className="error pad"> { error } </div> : '' }
          <div>
            <Link className="btn blue" to="/orders">Back</Link>
          </div>
            <div className="order-wrap">
                <span className="order-key">Email: </span>
                <span className="order-val">{email}</span>
            </div>
            <div className="order-wrap">
                <span className="order-key">Date Created: </span>
                <span className="order-val">{this.displayDate(date_entered) }</span>
            </div>
            <table>
                <thead>
                    <th>S/N</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Total</th>
                </thead>
                <tbody>
                    {
                        items.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.itemCode}</td>
                                    <td>{item.quantity}</td>
                                    <td>{this.format(item.amount, 2)}</td>
                                    <td>{this.format(item.total)}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
                <tbody>
                    <tr>
                        <td colSpan="4"></td>
                        <td><strong>Total: </strong></td>
                        <td><strong>{total} </strong></td>
                    </tr>
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
export default connect(mapStateToProps, null)(withRouter(ViewOrder));
