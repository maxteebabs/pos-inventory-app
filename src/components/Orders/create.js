// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react';
import { OrderService } from '../../services/Order';
import Header from '../common/Header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { ProductService } from '../../services/Product';
import { Link } from 'react-router-dom';
import { Order } from '../../models/Order';
import { OrderItem } from '../../models/OrderItem';
import Axios from 'axios';
import AsyncSelect  from 'react-select/async';

const service = new OrderService();
const productService = new ProductService();
// eslint-disable-next-line react/prefer-stateless-function
class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: null,
            customer_name: '',
            fullname: '',
            amount: 0,
            total: 0,
            netTotal: 0,
            vat: 5,
            quantity: 1,
            item_id: '',
            itemCode: '',
            itemName: '',
            orderRefCode: '',
            created_by: '',
            error: null,
            orders: [],
            items: [],
            products:[]
        };
        this.addItem = this.addItem.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.loadOptions = this.loadOptions.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.printOrder = this.printOrder.bind(this);
    }
    componentDidMount() {
        let fullname = this.props.fullname;
        this.setState({fullname});
        this.getProducts();

        this.setState({quantity: 1});
        this.quantity.focus(); 
        this.setState({amount: 0});
        this.amount.focus(); 
    }
    async getProducts() {
        Axios.all(await productService.getProductOptions(this.props.token)).then(data => {
          if(data[0].status === 405) {
            this.setState({error: "Unauthenticated User"});
            setTimeout(() => {
              localStorage.clear();
              this.props.history.push('/login');
            }, 1000);
          }
          if(data[0].status === 200) {  
              this.setState({products: data[0].data.products});
          }
        }).catch(err => {
            console.log(err);
            this.setState({error: 'Failed to retrieve products.' });
        });
    }
    searchOptions (inputValue) {
        let {products} = this.state;
        return products.filter((p, index) => {
            return p.label.toLowerCase().includes(inputValue.toLowerCase());
        });
    }
    loadOptions(inputValue, callback) {
        setTimeout(() => {
            callback(this.searchOptions(inputValue));
        }, 1000);
    }
    format(number, n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    }
    printOrder() {
        let {fullname, items, total, netTotal, vat} = this.state;
        let contents = "";
        var content_item = `<p><span style='width:30%;font-weight:bold;display:inline-block;'>Serial</span>
                <span style='width:65%;font-weight:bold;display:inline-block;'>Name</span></p>`;
        items.map((item, index) => {
            return content_item += `<p>
                <span style='width:30%;font-size:12px;display:inline-block;'>
                ${item.itemCode}</span> 
                <span style='width:70%;font-size:12px;word-wrap:break-word;
                    display:inline-block;height:auto;float:right;'>
                ${item.itemName}</span>
                </p>
                <p><span style='width:30%;font-size:12px;display:inline-block;'>${item.quantity}</span>
                <span style='width:5%;font-size:12px;display:inline-block;'>@</span> 
                <span style='width:25%;font-size:12px;display:inline-block;text-align:right;'>${item.amount} </span> 
                <span style='width:25%;font-size:12px;display:inline-block;text-align:right;'>${this.format(item.total, 2)}</span></p>`; 
        });
        let content_extra = `<p>
            <span style='width:50%;font-size:12px;font-weight:bold;display:inline-block;text-align:right'>Total: </span>
            <span style='width:35%;font-size:12px;font-weight:bold;display:inline-block;text-align:right'>${this.format(total, 2)}</span>
            </p>`;
        if(vat > 0) {
            content_extra += `<p>
            <span style='width:50%;font-size:12px;font-weight:bold;display:inline-block;text-align:right'>VAT: </span>
            <span style='width:35%;font-size:12px;font-weight:bold;display:inline-block;text-align:right'>${vat}</span>
            </p>
                <p>
                <span style='width:50%;font-size:12px;font-weight:bold;display:inline-block;text-align:right'>Net Total: </span>
                <span style='width:35%;font-size:12px;font-weight:bold;display:inline-block;text-align:right'>${this.format(netTotal, 2)}</span>
            </p>`;
        }
        content_extra += `<p>
            <span style='font-size:12px;font-weight:bold;display:inline-block;'>Cashier Name</span>
            <span style='font-size:12px;display:inline-block;'>${fullname}</span></p>
            <p><span style='font-size:10px;'>Thank you for shopping with us.</span></p>`;
        contents += content_item;
        contents += content_extra;
        var WinPrint = window.open('', '', 'width=900,height=650');
        WinPrint.document.write(contents);
        // WinPrint.document.write(printContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }
    async processOrder() {
        //process the order
        let {created_by, items, total, netTotal, vat} = this.state;
        let obj = {};
        obj.items = items;
        obj.created_by = created_by;
        obj.total = total;
        obj.vat = vat;
        obj.netTotal = netTotal;
        let order = new Order(obj);

        //make service call
        Axios.all(await service.create(order, this.props.token))
            .then(data => {
            if(data[0].status === 405) {
              this.setState({error: "Unauthenticated User"});
              setTimeout(() => {
                localStorage.clear();
                this.props.history.push('/login');
              }, 1000);
            }
            if(data[0].status === 200) {
                this.printOrder();
            //   alert('order created successfully');
            }
        }).catch(err => {
            console.log('err', err)
            this.setState({error: "Failed to process order."});
        });
    }
    addItem(event) {
        try {
            const { quantity, amount, items, itemCode, itemName, item_id  } = this.state;
            if(quantity < 1) {
                throw new Error('Quantity cannot be zero(0)');
            }
            if(amount <= 0) {
                throw new Error('Amount cannot be zero(0)');
            }
            //lets disconstruct the items
            let item = new OrderItem({amount, quantity, itemCode, itemName, item_id});
            items.unshift(item);
            this.setState({items: items, amount:0, quantity:1, itemCode:'', itemName: '', item_id: null});
            this.computeTotal();
        }catch(Error){
            console.log(Error)
        }
    }
    computeTotal() {
        let {items, vat} = this.state;
        let total = 0;
        let netTotal = 0;
        items.forEach((item, index) => {
            total += item.total;
        });
        if(vat > 0) {
            netTotal = ((vat / 100) * total) + total;
        }
        this.setState({total, netTotal});
    }
    clearItems() {
        this.setState({items: []});
    }
    removeItem(index) {
        let {items} = this.state;
        items.splice(index,1);
        this.setState({items});
    }
    handleInputChange(item) { 
        this.setState({amount: item.price});
        this.setState({ itemName: item.label });
        this.setState({ item_id: item.value });
        this.setState({ itemCode: item.itemCode });
    }
    render() {
        let {error, items, total, netTotal, vat} = this.state;
            return (
            // eslint-disable-next-line react/jsx-filename-extension
            <div>
                <Header />
                <ul className="sidenav" id="mobile-demo">
                    <li><a href="sass.html">Register</a></li>
                </ul>
                <div className="container">
                    <center><h4>New Order</h4></center>
                    <div className="row">
                        <div className="col s4">
                            <table id="printArea">
                                <tbody>
                                    {
                                        items.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.itemCode}<br /> {item.quantity} @</td>
                                                    <td>{item.itemName}<br /> {item.amount}</td>
                                                    <td>{item.total}</td>
                                                    <td className="contentToHide">
                                                        <i className="large material-icons" 
                                                             onClick={() => this.removeItem(index)}
                                                            style={{fontSize:18,color:'#fff'
                                                                , cursor: 'pointer', backgroundColor: 'red'
                                                                , padding:5, borderRadius: '100%'}}>clear</i>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                                {(items.length > 0) ? 
                                <tfoot>
                                    <tr>
                                        <td colSpan="2"> 
                                            <div className="textRight"><strong>TOTAL</strong></div>
                                            {(vat > 0) ?
                                            <div className="textRight">
                                                <div><strong>VAT</strong></div>
                                                <div><strong>NET TOTAL</strong></div>
                                            </div> : null 
                                            }
                                        </td>
                                        <td>
                                            <div><strong>{this.format(total, 2)}</strong></div>
                                            {(vat > 0) ?
                                            <div>
                                                <div><strong>{vat}%</strong></div>
                                                <div><strong>{this.format(netTotal, 2)}</strong></div>
                                            </div> : null
                                            }
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot> : null
                                }
                            </table>
                            <div className="row">
                                <div className="col s12">
                                {(items.length > 0) ? 
                                    <span>
                                    <button className="btn waves-effect waves-light blue" 
                                            style={{marginTop: '10px'}}
                                            onClick={() => this.processOrder()}>
                                            Submit
                                        </button>
                                        <button className="btn waves-effect waves-light red" 
                                        style={{marginTop: '10px', marginLeft: '5px'}}
                                        onClick={() => this.clearItems()}>
                                        Reset
                                    </button> 
                                </span> : null
                                } 
                                </div>
                            </div>
                        </div>
                        <div className="col s5">
                            <form>
                            <AsyncSelect
                                // cacheOptions
                                loadOptions={this.loadOptions}
                                defaultOptions
                                onChange={this.handleInputChange}
                            />
                            {/* <Select
                                // value={itemCode}
                                // onChange={this.handleChange}
                            //     options={products}
                            // /> */}
                                <div className="input-field">
                                    <div className="col s12">
                                        <select onChange={product => this.setState({product})}>
                                            <option></option>
                                        </select>
                                    </div>
                                </div>
                                <div className="input-field col s12">
                                    <input
                                        onChange={e => this.setState({ quantity: e.target.value })}
                                        id="quantity"
                                        ref={(input) => this.quantity = input}
                                        value={this.state.quantity}
                                        autoComplete="on"
                                        type="number"
                                        className="validate"
                                    />
                                    <label htmlFor="quantity">Quantity</label>
                                </div>
                                <div className="input-field col s12">
                                    <input
                                        onChange={e => this.setState({ amount: e.target.value })}
                                        id="amount"
                                        ref={(input) => this.amount = input}
                                        value={this.state.amount}
                                        autoComplete="on"
                                        type="number"
                                        className="validate"
                                    />
                                    <label htmlFor="amount">Amount</label>
                                </div>
                                <button onClick={this.addItem} 
                                    className="btn waves-effect waves-light blue" type="button" name="action">
                                    {(this.state._id) ? 'Save changes' : 'Add Item'}
                                </button>
                                    <Link style={{marginLeft: 10}} className="btn blue" to="/dashboard">Back</Link>
                            </form>
                        </div>
                        <div className="col s3">
                            {(items.length > 0) ? 
                                <table className="summary">
                                    <thead>
                                        <tr>
                                            <td><strong>Total: </strong></td>
                                            <td className="align-right"><strong>{total} </strong></td>
                                        </tr>
                                    </thead>
                                    {(vat > 0) ? 
                                    <tbody>
                                        <tr>
                                            <td><strong>VAT: </strong></td>
                                            <td className="align-right"><strong>{vat}% </strong></td>
                                        </tr>
                                        <tr>
                                            <td><strong>NET TOTAL: </strong></td>
                                            <td className="align-right"><strong>{netTotal} </strong></td>
                                        </tr>
                                    </tbody> : null
                                    }
                                </table> : null
                            }
                        </div>
                    </div>
                    <div className="row">
                        <form className="offset-s2 col s8">
                            <br />
                            {(error) ?
                                <div className="error pad"> {error} </div> : ''}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});
export default connect(mapStateToProps, null)(withRouter(AddOrder));
