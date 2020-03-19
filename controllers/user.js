'use strict'
//jwt
var jwt = require('jsonwebtoken');
//encrypting passwords.
var bcrypt = require('bcryptjs');
// Cargamos los modelos para usarlos posteriormente
var Users = require('../models/user');
var config = require('../config');

// Handle index actions
exports.index = function (req, res) {
    console.log("index")
    Users.get(function (err, users) {
        if (err) {

            return res.status(404).send({
                status: "error",
                message: err,
            });
        }

        return res.status(200).send({

            status: "success",
            message: "Users retrieved successfully",
            data: users
        });

    });
};



//login

exports.login = (req, res) => {
    console.log("imprime e request" + req.body.EmailUser);
    console.log("imprime e request" + req.body.PasswordUser);

    // Validate request
    if (!req.body.EmailUser) {
        return res.status(400).send({
            message: "User EmailUser can not be empty"
        });
    }

    if (!req.body.PasswordUser) {
        return res.status(400).send({
            message: "User PasswordUser can not be empty"
        });
    }

    Users.findOne({ EmailUser: req.body.EmailUser })
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "User not found with email " + req.body.EmailUser,
                    status: '400',
                    data: err
                });
            }
            if (users) {
                var passwordIsValid = bcrypt.compareSync(req.body.PasswordUser, users.PasswordUser);
                if (!passwordIsValid) {
                    return res.status(401).send({
                        error: 'Password Invalido',
                        auth: false,
                        token: null
                    })

                }

                var tokenData = {
                    id: users._id,
                    EmailUser: users.EmailUser,
                    NameUser: users.NameUser,
                    TypeUser: users.TypeUser,
                    StatusUser: users.StatusUser
                    // ANY DATA
                }

                var token =
                    jwt.sign(tokenData, config.SECRET_TOKEN, {
                        expiresIn: 60 * 60 * 24           // expires in 1 hours
                    })


                return res.status(200).send({
                    status: "success",
                    message: "User login",
                    auth: true,
                    token: token
                });
            }
        }).catch(err => {

            if (err.kind === 'EmailUser') {
                return res.status(404).send({
                    message: "User not found with id " + req.body.EmailUser,
                    status: '404',
                    data: err
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with id " + req.body.EmailUser,
                status: '500',
                data: err
            });


        });
};

//





//fin de login

// Handle view users info
exports.viewEmail = (req, res) => {
    console.log("viewEmail");
    // Validate request
    if (!req.params.EmailUser) {
        return res.status(400).send({
            message: "User EmailUser can not be empty"
        });
    }

    Users.findOne({ EmailUser: req.params.EmailUser })
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "User not found with email " + req.params.EmailUser,
                    status: '400',
                    data: err
                });
            }
            return res.status(200).send({
                status: "success",
                message: "Users found",
                data: users
            });

        }).catch(err => {
            console.log(err)
            if (err.kind === 'EmailUser') {
                return res.status(404).send({
                    message: "User not found with email " + req.params.EmailUser,
                    status: '404',
                    data: err
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with id " + req.params.EmailUser,
                status: '500',
                data: err
            });
        });
};



// Handle view users info
exports.view = (req, res) => {
    console.log("view");
    // Validate request


    if (!req.params.users_id) {
        return res.status(400).send({
            message: "User NameUser can not be empty"
        });
    }

    Users.findById(req.params.users_id)
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.users_id,
                    status: '400',
                    data: err
                });
            }
            return res.status(200).send({
                status: "success",
                message: "Users found",
                data: users
            });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.users_id,
                    status: '404',
                    data: err
                });
            }
            return res.status(500).send({
                message: "Error retrieving User with id " + req.params.users_id,
                status: '500',
                data: err
            });
        });
};

// Create and Save a new User
exports.new = (req, res) => {
    console.log("new  ");
    // Validate request
    if (!req) {
        return res.status(400).send({
            message: "User body can not be empty",
            data: res.err
        });
    }



    var users = new Users();
    users.NameUser = req.body.NameUser ? req.body.NameUser : users.NameUser;
    users.LastNameUser = req.body.LastNameUser;
    users.EmailUser = req.body.EmailUser;
    users.PasswordUser = bcrypt.hashSync(req.body.PasswordUser, 8);
    users.StatusUser = req.body.StatusUser;
    users.DateBeginUser = req.body.DateBeginUser ? req.body.DateBeginUser : new Date();
    users.TypeUser = req.body.TypeUser;
    // Save User in the database
    users.save()
        .then(users => {
            return res.status(200).send({
                message: 'New user created!',
                status: "success",
                data: users
            });
        }).catch(err => {
            res.status(400).send({
                message: err.message || "Some error occurred while creating the User.",
                status: '400',
                data: err

            });
        });
};







// Update a note identified by the UserId in the request
exports.update = (req, res) => {
    console.log("update  " + req.params.users_id);
    // Find note and update it with the request body

    Users.findByIdAndUpdate({ _id: req.params.users_id }, {
        NameUser: req.body.NameUser ? req.body.NameUser : users.NameUser,
        LastNameUser: req.body.LastNameUser ? req.body.LastNameUser : users.LastNameUser,
        StatusUser: req.body.StatusUser ? req.body.StatusUser : users.StatusUser,
        EmailUser: req.body.EmailUser ? req.body.EmailUser : users.EmailUser,
        PasswordUser: bcrypt.hashSync(req.body.PasswordUser, 8),
        DateBeginUser: new Date()
    }, { new: true })
        .then(users => {

            if (!users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.users_id,
                    status: '404',
                    data: err
                });
            }
            return res.status(200).send({
                message: 'user Info updated',
                status: "success",
                data: users
            });

        }).catch(err => {
            console.log("err" + err);
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.users_id,
                    status: '404',
                    data: err
                });
            }
            return res.status(500).send({
                message: "Error updating user with id " + req.params.users_id,
                status: '500',
                data: err
            });
        });
};




// Delete a Users with the specified UsersId in the request
exports.delete = (req, res) => {
    console.log("delete  " + req.params.users_id);
    if (!req.params.users_id) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    Users.findByIdAndRemove(req.params.users_id)
        .then(users => {
            if (!users) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.users_id,
                    status: '404',
                    data: err
                });
            }
            res.send({
                message: "User deleted successfully!",
                status: "success",
                data: users
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'Not Found') {
                return res.status(404).send({
                    message: "can not delete User with id " + req.params.users_id,
                    status: '404',
                    data: err
                });
            }
            return res.status(404).send({
                message: "Could not delete User with id  " + req.params.users_id,
                status: '404',
                data: err
            });
        });
};


