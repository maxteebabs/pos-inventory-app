// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { UserService } from '../../services/UserService';
import Header from '../common/Header';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import Axios from 'axios';
import moment from 'moment';

const userService = new UserService();
// eslint-disable-next-line react/prefer-stateless-function
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isAdmin: false,
      isActive: false,
      date_entered: "",
      users: [],
      error: null,
      success: ""
    };
    this.getUsers = this.getUsers.bind(this);
    this.toggleAdmin = this.toggleAdmin.bind(this);
  }
  componentDidMount() {
    this.getUsers();
  }
  async getUsers() {
      Axios.all(await userService.getAll(this.props.token)).then(data => {
        if(data[0].status === 405) {
          this.setState({error: "Unauthenticated User"});
          setTimeout(() => {
            localStorage.clear();
            this.props.history.push('/login');
          }, 1000);
        }
        if(data[0].status === 200) {
            this.setState({users: data[0].data.users});
        }
      }).catch(err => {
          console.log(err);
          this.setState({error: 'Failed to retrieve users.' });
      });
  }
  async confirmDelete(id, index) {
    var c = window.confirm("Are you sure you want to delete this item?");
    if(c) {
        let resp = await userService.delete(id, this.props.token);
        if(resp.status === 200) {
          toastr.success(resp.data.msg);
          //we need to pop it out
          let { users } = this.state;
          users.splice(index, 1);
          this.setState({users});
        }else {
          this.setState({error: resp.data.msg});
          toastr.error(resp.data.msg);
        }
    }
    return false;
  }
  displayDate(d) {
      let formattedDate = moment(d).format('YYYY-MM-DD');
      return formattedDate;
  }
  async toggleAdmin(userId) {
      let resp = await userService.toggleAdmin(userId, this.props.token);
      console.log(resp);
      if(resp.status){
        this.setState({success: "Successful"});
        this.getUsers();
      }
  }
  render() {
    let { users, error, success } = this.state;
    // console.log(this.props)
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <div>
        <Header />
        <div className="container">
          <center>
            <h4>Users</h4>
          </center>
          {error ? <div className="error pad"> {error} </div> : ""}
          {success ? <div className="success pad"> {success} </div> : ""}
          <Link className="btn blue" to="/dashboard">
            Back
          </Link>
          <table className="striped responsive-table users">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date Entered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <tr className="products" key={index}>
                    <td>{index + 1}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Admin" : "User"}</td>
                    <td>{user.isActive ? "Active" : "Inactive"}</td>
                    <td>{this.displayDate(user.date_entered)}</td>
                    <td>
                      {this.props.isAdmin && this.props.id !==user._id &&
                      <button className="btn blue"
                        onClick={() => this.toggleAdmin(user._id)}>
                          {user.isAdmin ? 'Change to User' :  'Change to Admin' } 
                          </button>
                        }
                      {user.isAdmin && (
                        <a
                          href="#"
                          className="btn blue"
                          onClick={() => this.confirmDelete(user._id, index)}
                        >
                           Delete
                        </a>
                      )}
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
export default connect(mapStateToProps, null)(withRouter(User));
