// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { ProductService } from '../../services/Product';
import Header from '../common/Header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import Axios from 'axios';

const service = new ProductService();
// eslint-disable-next-line react/prefer-stateless-function
class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      serialNo: "",
      price: "",
      quantity: "",
      description: "",
      products: [],
      error: null,
      page: 1,
      total_pages: null,
      total_rows: null,
      search: ""
    };
    this.getProducts = this.getProducts.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }
  componentDidMount() {
    if (this.search) {
      this.handleSearch();
    } else {
      this.getProducts(this.page);
    }
  }
  async getProducts(page) {
      Axios.all(await service.getAll(this.props.token, page)).then(data => {
        if(data[0].status === 405) {
          this.setState({error: "Unauthenticated User"});
          setTimeout(() => {
            localStorage.clear();
            this.props.history.push('/login');
          }, 1000);
        }
        if(data[0].status === 200) {
            let result = data[0].data;
            this.setState({products: result.products
              , page:result.page, total_rows: result.total_rows
              , total_pages: result.total_pages});
        }
      }).catch(err => {
          console.log(err);
          this.setState({error: 'Failed to retrieve products.' });
      });
  }
  changePage(page) {
    if(page < 1) {
      page = 1;
    }else if(page > this.state.total_pages) {
      page = this.state.total_pages;
    }
    this.setState({page});
    if(this.search) {
        this.handleSearch();
    }else{
        this.getProducts(page);
    }
  }
  getImage(image) {
      var url = "";
      if(image) {
          url = `data:image/png;base64, ${image}`;
      }
      return url;
  }
  async handleSearch() {
    let {search, page} = this.state;
      Axios.all(await service.search(this.props.token, {page, search})).then(data => {
        if(data[0].status === 405) {
          this.setState({error: "Failed to retrieve searched products"});
        }
        if(data[0].status === 200) {
            let result = data[0].data;
            this.setState({products: result.products
              , page:result.page, total_rows: result.total_rows
              , total_pages: result.total_pages});
        }
      }).catch(err => {
          console.log(err);
          this.setState({error: 'Failed to retrieve products.' });
      });
  }
 
  async confirmDelete(id, index) {
    var c = window.confirm("Are you sure you want to delete this item?");
    if(c) {
        let resp = await service.delete(id, this.props.token);
        if(resp.status === 200) {
          toastr.success(resp.data.msg);
          //we need to pop it out
          let { products } = this.state;
          products.splice(index, 1);
          this.setState({products});
        }
    }
    return false;
  }
  render() {
    let { products, error, page } = this.state;
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        <Header />
        <div className="container">
          <center>
            <h4>Products</h4>
          </center>
          {error ? <div className="error pad"> {error} </div> : ""}
          <div>
            <Link className="btn blue" to="/dashboard">
              Back
            </Link>
            <span style={{ textAlign: "right", float: "right" }}>
              <Link to={{ pathname: `/product/add/` }} className="btn blue">
                Create
              </Link>
            </span>
          </div>
          <div className="row">
            <form className="col s12">
              <div className="row" style={{ marginBottom: 0, marginTop: 10 }}>
                <div className="input-field col s6">
                  <input
                    onChange={e => this.setState({ search: e.target.value })}
                    id="icon_prefix"
                    type="text"
                    className="validate"
                  />
                  <label htmlFor="icon_prefix">Search by Serial/Product Name</label>
                </div>
                <div className="input-field col s6">
                  <button
                    onClick={this.handleSearch}
                    className="btn waves-effect waves-light blue"
                    type="button"
                    name="action"
                  >
                    <i className="material-icons ">search</i>
                  </button>
                </div>
              </div>
            </form>
          </div>
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

          <table className="striped responsive-table">
            <thead>
              <tr>
                <th>Serial No</th>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                return (
                  <tr className="products" key={index}>
                    <td>{product.serialNo}</td>
                    <td>
                      <img
                        className="thumbnail"
                        src={this.getImage(product.image)}
                        alt={product.name}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>
                    <td>
                      <Link
                        to={{ pathname: `/product/edit/${product._id}` }}
                        className=""
                      >
                        Edit
                      </Link>{" "}
                      |
                      {/* <Link  to={`/product/delete/${product._id}`} 
                            className="">Delete</Link> */}
                      <a
                        href="#"
                        className="delBtn"
                        onClick={() => this.confirmDelete(product._id, index)}
                      >
                        {" "}
                        Delete
                      </a>
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
export default connect(mapStateToProps, null)(withRouter(Product));
