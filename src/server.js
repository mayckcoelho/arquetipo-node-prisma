// var fs = require('fs');
// var https = require('https');

// // Certificate
// const privateKey = fs.readFileSync('/sslcertificate/path/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/sslcertificate/path/cert.pem', 'utf8');
// const ca = fs.readFileSync('/sslcertificate/path/chain.pem', 'utf8');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// };

const express = require('express');
const users = require('./routes/users');
const cors = require('cors');

var jwt = require('jsonwebtoken');
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.json({ 'tutorial': 'Está é a API do Contexto Auth!' });
});

app.use(function (req, res, next) {
    req.url = req.url.replace(/[/]+/g, '/'); next();
})

// routes
app.use('/users', users);

function validateUser(req, res, next) {
    if (req.url != '/users/login') {
        const authorization = req.headers['authorization']
        if (!authorization) {
            res.status(401).json({ status: "error", message: "Header Authorization not found" })
        }

        const token = authorization.replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                res.status(401).json({ status: "error", message: err.message });
            } else {
                // add user id to requests
                req.body.userId = decoded.id;
                next();
            }
        });
    } else {
        next();
    }
}

// handle 404 error
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({ status: "error", message: "Not found", url: req.url });
    else
        res.status(500).json({ status: "error", message: err.message });
});

const port = process.env.PORT || 3000

// http config
module.exports = app.listen(port, function () { console.log(`Node server listening WITHOUT SSL on port ${port}`) })

// https config
// const httpsServer = https.createServer(credentials, app)
// httpsServer.listen(port, function () { console.log(`Node server listening WITH SSL on port ${port}`); });