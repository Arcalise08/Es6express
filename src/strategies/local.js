import passport from "./jwt.js";
import LocalStrategy from "passport-local";
import {Users} from "../models.js";

passport.use(new LocalStrategy.Strategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, callback) => {
    Users.findOne({username: username}, (error, user) => {
        if (error) {
            return callback(error)
        }
        if (!user) {
            return callback(null,false, {message: 'Incorrect username|password'});
        }
        if (!user.validatePassword(password)) {
            return callback(null, false, {message: 'Incorrect username|password'});
        }
        return callback(null, user);
    });
}));

export default passport;
