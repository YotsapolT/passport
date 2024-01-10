const express = require("express")
const router = express.Router()
const bcrypy = require('bcryptjs')

//user model
const User = require('../models/User')
//const db = require('../models/User')

//login page
router.get("/login", (req, res) => res.render("login"))

//register page
router.get("/register", (req, res) => res.render("register"))

//register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    //check password math
    if (password != password2) {
        errors.push({ msg: 'Password do not match' })
    }

    //check password lenght
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' })
    }
    if (errors.length > 0) { //not pass
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user exists
                    errors.push({ msg: 'This email already registerd' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    bcrypy.genSalt(5, (err, salt) =>
                        bcrypy.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash
                            console.log(salt)
                            newUser.save()
                                .then(() => {
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))

                        }))

                    // let post = { username: name, email: email, pwd: password };
                    // let sql = 'INSERT INTO account SET ?';
                    // let query = db.query(sql, post, (err, result) => {
                    //     if (err) throw err;
                    //     res.redirect('/users/login');
                    // });
                }
            })
    }
})
        

//login handle
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    let errors = [];
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            errors.push({ msg: 'This email not registerd' })
            res.render('login', {
                errors,
                email,
                password,
            });
        } else {
            console.log("Input password: ", password)
            console.log("DB password: ", user.password)
            if (bcrypy.compareSync(password, user.password))
                res.render('dashboard', {
                    user,
                });
        }
    })
})

// // Login handle using a GET request
// router.get('/successLogin', (req, res) => {
//     // Retrieve email and password from query parameters
//     const email = req.query.email;
//     const password = req.query.password;



//     if (!email || !password) {
//         // Handle missing parameters
//         return res.status(400).json({ error: 'Both email and password are required.' });
//     }

//     let errors = [];

//     // Use MySQL query to retrieve the user by email
//     const selectUserQuery = "SELECT * FROM account WHERE email = ?";
//     const queryWithParameters = db.format(selectUserQuery, [email]);
//     console.log(queryWithParameters);

//     db.query(selectUserQuery, [email], (err, results) => {
//         if (err) {
//             console.error(err);
//             // Handle the error
//             return res.status(500).json({ error: 'An error occurred while processing your request.' });
//         } else {
//             const user = results[0];
//             if (!user) {
//                 errors.push({ msg: "This email is not registered" });
//                 res.render("login", { errors, email, password });
//             } else {
//                 // Compare the stored password with the input password
//                 if (user.pwd === password) {
//                     res.render("dashboard", { user });
//                 } else {
//                     errors.push({ msg: "Wrong password" });
//                     res.render("login", { errors, email, password });
//                 }
//             }
//         }
//     });
// });

module.exports = router;