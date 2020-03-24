// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { ProductService } from '../../services/Product';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Product } from '../../models/Product';
import Axios from 'axios';

const service = new ProductService();
// eslint-disable-next-line react/prefer-stateless-function
class AddProduct extends Component {
  images = [];
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      name: '',
      serialNo: '',
      price: '',
      quantity: '',
      description: '',
      error: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFileChangeHandler = this.onFileChangeHandler.bind(this);
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    if(params.id) {
      this.getProduct(params.id);
    }
  }
  async getProduct(id) {
    Axios.all(await service.get(this.props.token, id)).then(data => {
      if(data[0].status === 405) {
        this.setState({error: "Unauthenticated User"});
        setTimeout(() => {
          localStorage.clear();
          this.props.history.push('/login');
        }, 1000);
      }
      if(data[0].status === 200) {
          let product = data[0].data.product;
          this.setState({_id: product._id});
          this.name.focus(); 
          this.setState({name: product.name});
          this.price.focus(); 
          this.setState({price: product.price});
          this.quantity.focus(); 
          this.setState({quantity: product.quantity});
          this.serialNo.focus(); 
          this.setState({serialNo: product.serialNo});
          this.setState({description: product.description});
          this.description.focus(); 

      }
    }).catch(err => {
        console.log(err);
        this.setState({error: 'Failed to retrieve products.' });
    });
}
  onFileChangeHandler(e) {
    let files = Array.from(e.target.files);
    for(var i = 0; i < files.length; i++){
      // eslint-disable-next-line no-loop-func
      this.encodeImageFileAsURL(files[i], url => {
        this.images.push(url);
      });
    }
    // this.setState({
    //   image: e.target.files,
    //  });
  }

   encodeImageFileAsURL(file, callback) {
    // var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      // console.log('RESULT', reader.result);
      callback(reader.result);
    }
    reader.readAsDataURL(file);
  }
  async handleSubmit(event) {
    // e.preventDefault();
    const { name, price, quantity, description, serialNo, _id } = this.state;
    this.setState({error: null});
    if(name && price && quantity) {

      //object
      let obj = {};
      obj._id = _id;
      obj.name = name;
      obj.price = price;
      obj.quantity = quantity;
      obj.image =  JSON.stringify(this.images);
      obj.description = description;
      obj.serialNo = serialNo;
      let product = new Product(obj);

      if(product._id) {
            Axios.all(await service.update(product, this.props.token))
            .then(data => {
            
            if(data[0].status === 405) {
              this.setState({error: "Unauthenticated User"});
              setTimeout(() => {
                localStorage.clear();
                this.props.history.push('/login');
              }, 1000);
            }
            if(data[0].status === 200) {
              this.props.history.push('/product');
            }
          }).catch(err => {
            console.log('err', err)
            this.setState({error: "Incorrect email/password combination."});
          });
      }else {
          Axios.all(await service.create(product, this.props.token))
          .then(data => {
          
          if(data[0].status === 405) {
            this.setState({error: "Unauthenticated User"});
            setTimeout(() => {
              localStorage.clear();
              this.props.history.push('/login');
            }, 1000);
          }
          if(data[0].status === 200) {
            this.props.history.push('/product');
          }
        }).catch(err => {
          console.log('err', err)
          this.setState({error: "Incorrect email/password combination."});
        });
      }
      
    }else {
      this.setState({error: "Name, Price and Quantity fields are required"});
    }
  }

  render() {
    const error = this.state.error;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        <Header />
        <ul className="sidenav" id="mobile-demo">
          <li><a href="sass.html">Register</a></li>
        </ul>
        <div className="container">
          <center><h4>Add Product</h4></center>
          <div className="row">
            <form className="offset-s2 col s8">
              <br />
              { (error) ? 
                <div className="error pad"> { error } </div> : '' }
              <div className="row">
                <div className="input-field col s6">
                  <input
                    onChange={e => this.setState({ name: e.target.value })}
                    id="name"
                    ref={(input) => this.name = input}
                    value={this.state.name}
                    autoComplete="on"
                    type="text"
                    className="validate"
                  />
                  <label htmlFor="name">Product Name</label>
                </div>
                <div className="input-field col s6">
                  <input
                    onChange={e => this.setState({ serialNo: e.target.value })}
                    id="serialNo"
                    value={this.state.serialNo}
                    ref={(input) => this.serialNo = input}
                    autoComplete="on"
                    type="text"
                  />
                  <label htmlFor="serialNo">serialNo</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s6">
                  <input
                    onChange={e => this.setState({ price: e.target.value })}
                    id="price"
                    value={this.state.price}
                    ref={(input) => this.price = input}
                    autoComplete="on"
                    type="number"
                    className="validate"
                  />
                  <label htmlFor="price">Price</label>
                </div>
                <div className="input-field col s6">
                  <input
                    onChange={e => this.setState({ quantity: e.target.value })}
                    id="quantity"
                    value={this.state.quantity}
                    ref={(input) => this.quantity = input}
                    autoComplete="on"
                    type="number"
                    className="validate"
                  />
                  <label htmlFor="quantity">Quantity</label>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <div className="file-field input-field">
                    <div className="btn blue">
                      <span>Image</span>
                      <input
                      onChange={this.onFileChangeHandler}                      
                      type="file"
                      multiple
                      />
                    </div>
                    <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    onChange={e => this.setState({ description: e.target.value })}
                    id="description"
                    autoComplete="on"
                    value={this.state.description}
                    ref={(input) => this.description = input}
                    type="text"
                    className="validate"
                  />
                  <label htmlFor="description">Description</label>
                </div>
              </div>
              <button onClick={ this.handleSubmit } 
                className="btn waves-effect waves-light blue" type="button" name="action">
                 {(this.state._id) ? 'Save changes' : 'Submit' }
              </button>
              <Link style={{ marginLeft: 10 }} className="btn blue" to="/dashboard">Back</Link>
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
export default connect(mapStateToProps, null)(withRouter(AddProduct));
