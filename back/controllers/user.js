const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

/* Register an account */
exports.signup = (req, res, next) => {
    // console.log('Signup API', req.body);
    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new User({email: req.body.email,password: hash});
        user.save()
        .then(() => res.status(200).json({message:'User created'}))
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

/* Login */
exports.login = (req, res, next) => {
    // console.log('Login API', req.body);
    
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'User not found'});
        }

        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ message: 'Error on email or password' });
            }
            
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )  
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
 };