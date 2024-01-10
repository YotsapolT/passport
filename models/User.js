const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const User = mongoose.model('User', UserSchema)

module.exports = User

// const mysql = require('mysql')
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "qead8T31",
//     database: 'SystemSecure'
// });

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
// })

// module.exports = db