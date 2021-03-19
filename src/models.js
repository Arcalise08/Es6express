import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = mongoose.Schema({
    username : {type: String, required: true},
    password : {type: String, required: true},
    email : {type: String, required: true},
    phoneNumber: {type: String, required: false},
    image: {type: String, required: false}
});


userSchema.statics.hashPassword = function(password) {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export const Users = mongoose.model('user', userSchema);


