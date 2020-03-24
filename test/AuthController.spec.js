var chai = require('chai');
var chaiHttp = require('chai-http');
chai.should();
var app = require ('../server/index');

const loginCredential = { email : 'test@gmail.com', password: 'admin'};
const registerCredentials = { email : 'test@gmail.com', password: 'admin', confirm_password: 'admin', fullname: 'Rachael Kest'};
describe('user authentication', () => {
    // describe("register a user", () => {
    //     it('should register a user', (done) => {
    //         chai.request(app).post('/api/register')
    //         .send(registerCredentials)
    //         .end((err, res) => {
    //             if(err) { done(err); }
    //             res.should.have.status(200);
    //             res.body.message.should.equal("Success");
    //             res.body.should.have.property('status');
    //             done();
    //         })
    //     })
    // });
    describe("login a user", () => {
        it('should login a user', (done) => {
            chai.request(app).post('/api/login')
            .send(loginCredential)
            .end((err, res) => {
                if(err) done(err);
                res.should.have.status(200);
                res.body.user.email.should.equal(loginCredential.email);
                res.body.should.have.property('token');
                done();
            })
        })
    })
})