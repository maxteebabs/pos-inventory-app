/* eslint-disable no-undef */
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var app = require ('../server/index');


chai.use(chaiHttp);
var assert = chai.assert;
var expect = chai.expect;
chai.should();

let token = null;
const loginCredential = { email : 'test@gmail.com', password: 'admin'};
let users = [];
describe('Users', () => {
    before((done) => {
        chai.request(app).post('/api/login')
            .send(loginCredential)
            .end((err, response) =>{
                if(err) done(err);
                token = response.body.token;    
                done();
            });
    });
    describe('get all users', () => {
        it('should get all users and return a status of 200', async () => {
            var res = await chai.request(app).get('/api/users/')
                .set('x-access-token', token);
            users = res.body.users;
            res.should.have.status(200);
            res.body.should.have.property('users');
            res.body.users.should.be.a('array');
            res.body.users[0].should.be.a('object');
        });
    });
    
    describe('delete a user', () => {
        it('should return 200 when you delete user', async () => {
            //first we need to create a user
            let user = users.filter((user, index) => {
                if(user.email === 'test7@gmail.com'){
                    return true;
                }
                return false;
            });
            if(user.length > 0 ) {
                let url = '/api/user/delete/'+user[0]._id;
                var res = await chai.request(app).delete(url)
                    .set('x-access-token', token);
                res.should.have.status(200);
                res.body.msg.should.equal("user deleted successfully.");
            }
        });
    });
});