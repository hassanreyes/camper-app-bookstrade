var Account = require('./models/account');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    LocalStrategy = require('passport-local');
    
module.exports = function(passport){
    
    // Setting up local login strategy
    const localLogin = new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {  
        Account.findOne({ email: email }, function(err, user) {
            if(err) { return done(err); }
            if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }
            
            user.comparePassword(password, function(err, isMatch) {
                if (err) { return done(err); }
                if (!isMatch) { return done(null, false, { error: "Your login details could not be verified. Please try again." }); }
                
                return done(null, user);
            });
        });
    });
    
    const jwtOptions = {  
        // Telling Passport to check authorization headers for JWT
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        // Telling Passport where to find the secret
        secretOrKey: process.env.JWT_SECRET,
        aud: 'localhost',
        iss: 'localhost'
    };
    
    // Setting up JWT login strategy (the payload is the user)
    const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) { 
        Account.findById(payload._id, function(err, user) {
            if (err) { console.log(err); return done(err, false); }
    
            if (user) {
              done(null, user);
            } else {
              done(null, false);
            }
        });
    });
    
    passport.use('jwt', jwtLogin);  
    passport.use(localLogin); 
    
};