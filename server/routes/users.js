var Account = require('./../models/account');
var jwt = require('jsonwebtoken');


var routes = function(app, router, passport) {
    
    const requireAuth = passport.authenticate('jwt', { session: false });  
    const requireLogin = passport.authenticate('local', { session: false });  
    
    // Set user info from request
    function setUserInfo(request) {  
        return {
            _id: request._id,   
            email: request.email,
            profile: request.profile
        };
    }
    
     
    function generateToken(user) {  
        return jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: 10080 // in seconds
        });
    }
  
    // Register
    router.get('/signup', (req, res) => {
        res.render('signup');
    });
    
    router.post('/signup', (req, res, next) => {
        
        const email = req.body.email;
        const password = req.body.password;
        
        // Return error if no email provided
        if (!email) {
            return res.status(422).send({ error: 'You must enter an email address.'});
        }
        
        // Return error if no password provided
        if (!password) {
            return res.status(422).send({ error: 'You must enter a password.' });
        }
        
        Account.findOne({ email: email }, function(err, existingUser) {
            if (err) { return next(err); }
            
            // If user is not unique, return error
            if (existingUser) {
                return res.status(422).send({ error: 'That email address is already in use.' });
            }
            
            // If email is unique and password was provided, create account
            var user = new Account({
                email: email,
                password: password,
                profile: { 
                    firstName: '',
                    lastName: '',
                    city: ''
                }
            });
            
            user.save(function(err, user) {
                if (err) { return next(err); }
            
                // Respond with JWT if user was created
                var userInfo = setUserInfo(user);
                
                res.status(201).json({
                  token: 'JWT ' + generateToken(userInfo),
                  user: userInfo
                });
            });
        });
        
    });
    
    // Login 
    router.get('/signin', requireAuth, (req, res) => {
        console.log("authorized");
        res.status(200).json({
            user: req.user
        });
    });
    
    router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: 'Invalid username or password.', session: false }), (req, res, next) => {
        
        var userInfo = setUserInfo(req.user);
        
        res.status(200).json({
           token: 'JWT ' + generateToken(userInfo),
           user: userInfo
        });
    });
    
    // Profile
    router.get('/profile', requireAuth, (req, res) => {
        res.status(200).json({
            user: req.user
        });
    });
    
    router.post('/profile', requireAuth, (req, res) => {
        var user = req.user;
        console.log(req.body);
        user.profile.firstName = req.body.user.profile.firstName;
        user.profile.lastName = req.body.user.profile.lastName;
        user.profile.city = req.body.user.profile.city;
        
        user.save((err, data) => {
            if(err){ 
                return res.status(422).json({
                    error: 'An error ocurred updating profile'
                });
            }
            
            res.status(200).json({
                user: data
            });
        });
    });
    
    // Logout
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
    
    return router;
};

module.exports = routes;