import passport from 'passport'
import {Users} from '../models.js';
import passportJWT from 'passport-jwt';
import dotenv from "dotenv";
dotenv.config()

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, (jwtPayload,callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null,user);
        })
        .catch((error) => {
            return callback(error)
        });
}));

export default passport;
