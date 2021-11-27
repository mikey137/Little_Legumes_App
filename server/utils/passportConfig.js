const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            bcrypt.compare(password, user.password, (err, result) => {
                if(err) throw err
                if(result === true){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            })
        });
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });

  module.exports = { passport }