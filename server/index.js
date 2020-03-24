const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const uuid = require('uuid');
const morgan = require('morgan');
const routes = require('./routes/');
const app = express();
const open = require('open');
const path = require('path');
// swagger
// app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));



try {
    //routes
    const router = express.Router();
    routes(router);

    let port = process.env.PORT || 4000;

    try {
        mongoose.set('useCreateIndex', true);
        const db_string = process.env.DBCONNECTIONSTRING;
        mongoose.connect(db_string, { useNewUrlParser: true }).then(() => { // if all is ok we will be here
            console.log("connected");
        })
        .catch(err => { // we will not be here...
            console.error('App starting error: Network Issue');
            return { error: err.stack, message: "Error Connecting to mongo db" };
        });
        
    }catch(err) {
        console.log(err);
    }
    // set up middlewares
    app.use(session({
        genid: (req) => {
        return uuid() // use UUIDs for session IDs
        },
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));
    // app.use(csrf());
    app.use(morgan('dev')); 
    app.use(cors());
    app.use(bodyParser.json({ limit: '100mb' }));

    app.use('/api', router);

    app.use(express.static(path.join(__dirname, '../build')));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../build', 'index.html'));
    });
    (async () => {
        // await open(`localhost:${port}`, { app: 'firefox' });
    })();
    // this redirects a non found route to the home page
    app.get('*', function(req, res) {
        res.redirect('/api/login');
    });
    // start server
    // @ts-ignore
    if(require.main === module) {
        app.listen(port, () =>  {
            console.log('server started on ' + port);
        });
    }else {
        //export app for testing
        module.exports = app;
    }

}catch(err) {
    console.log(err)
}

