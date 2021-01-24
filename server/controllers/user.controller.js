const db = require("../mongo");
const user = db.user;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require('../jwt/jwt.config.js'); // get config file

exports.login = (req, res) => {
    user.findOne({ username: req.body.username }, function (err, usr) {
        if (err) return res.status(500).send('Error on the server.');
        if (!usr) return res.status(404).send('No user found.');

        // check if the password is valid
        var passwordIsValid = bcrypt.compareSync(req.body.password, usr.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        // if user is found and password is valid
        // create a token
        var token = jwt.sign({ id: usr._id, role: usr.role }, config.key, {
            expiresIn: 86400 // expires in 24 hours
        });

        // return the information including token as JSON
        res.status(200).send({ auth: true, username: usr.username, token: token });
    });
}

exports.register = (req, res) => {
    if (req.userRole !== 'A') return res.status(401).send("Not permitted!");
    user.countDocuments({ username: req.body.username }, function (err, cnt) {
        if (cnt > 0) return res.status(500).send("User already registered.");

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        user.create({
            username: req.body.username,
            role: req.body.role,
            password: hashedPassword,
            tagCount: 0
        },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem registering the user`.");

                res.status(200).send("User registered.");
            });
    })

}

exports.tagCount = (req, res) => {
    user.findById(req.userId).then(usr => {
        res.status(200).send({tagCount: usr.tagCount})
    })
}