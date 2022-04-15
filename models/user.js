/* {
    name: 'Zully Chumpitaz',
    email: 'zully.chumpitaz@gmail.com',
    password: '123456',
    img: 'url_img',
    role: 'admin',
    status: false,
    google: false
} */

const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ]
    },
    email: {
        type: String,
        required: [ true, 'El email es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'El password es obligatorio' ]
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
}

module.exports = model( 'User', UserSchema );