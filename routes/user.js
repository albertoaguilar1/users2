'use strict'
// Cargamos el módulo de express para poder crear rutas
var express = require('express');
// Llamamos al router
var api = express.Router();
//jwt token
var jwt = require('jsonwebtoken')
// Cargamos el controlador
var usersController = require('../controllers/user');

var authenticated = require('../middlewares/authenticated');




api.get('/',function(req,res){
    res.json({
        status:'API USERS WORKING',
        message:'Welcome to the root of the service'
    });
});


    // Contact routes
    api.route('/users')
    .get(authenticated,usersController.index)
    .post(usersController.new);
    
    
    api.route('/users/:users_id')
    .get(authenticated,usersController.view)
    .patch(authenticated,usersController.update)
    .put(authenticated,usersController.update)
    .delete(authenticated,usersController.delete);
    
    
    api.route('/users/email/:EmailUser')
    .get(usersController.viewEmail);
   

    api.route('/login')
    .post(usersController.login);
     

// Exportamos la configuración
module.exports = api;