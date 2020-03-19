"use strict"

var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server=require("../app");
let should = chai.should();
const expect = require('chai').expect;
 var request = require('supertest')
chai.use(chaiHttp);

var request = request("http://localhost:8080")




 describe('users', function() { 
    describe('POST', function(){    

        
        it('Should  insert json users', function(done){
        request.post('/api/users')
        .send({NameUser: "test"  , LastNameUser: "test" , EmailUser: "test@xxx.com",  PasswordUser:"test",StatusUser:true , TypeUser:{IdType:"1",Role:"Admin",DescripTypeUser:"Control de modulos"} } )    
        .expect('Content-Type', /json/)
            .end( function(err,res){              
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("success");
                expect(res.body.message).to.equals("New user created!");
                done();
            });       
     });

     it('Should  not insert json users why NameUser is empty', function(done){
        request.post('/api/users')      
        .send({NameUser:"", LastNameUser: "test" , EmailUser: "test@xxx.com",  PasswordUser:"test",StatusUser:true,DateBeginUser:"2019-10-21T05:00:00.000Z" , TypeUser:{IdType:"1",Role:"Admin",DescripTypeUser:"Control de modulos"} } )
            .expect('Content-Type', /json/)
            .end( function(err,res){                         
                expect(res).to.have.status(400);
                expect(res.body.status).to.equals("400");
                expect(res.body.data._message).to.equals("Users validation failed");
                done();
    });
});

it('Should  not insert json users why Correo ya existente', function(done){
    request.post('/api/users')      
    .send({NameUser:"test", LastNameUser: "test" , EmailUser: "test@xxx.com",  PasswordUser:"test",StatusUser:true, TypeUser:{IdType:"1",Role:"Admin",DescripTypeUser:"Control de modulos"} } )
        .expect('Content-Type', /json/)
        .end( function(err,res){               
            expect(res).to.have.status(400);
            expect(res.body.status).to.equals("400");     
            expect(res.body.data.message).to.equals("Users validation failed: EmailUser: The email or ID test@xxx.com already exists in the database");
            done();
});
});
    
    it('Should  not insert the user why reques json user  is empty', function(done){
        request.post('/api/users')  
            .expect('Content-Type', /json/)
            .end( function(err,res){                                 
                expect(res).to.have.status(500);
                expect(res.body.message).to.equals("Illegal arguments: undefined, string");            
               
                done();
    });
   
    });             
    });//la funcion users POST


    describe('GET', function(){
        let id = "";
        let valor = "test@xxx.com";
        let idtest = 1;
        let token="";
    
            it('Should  login', function(done){
            request.post('/api/login')
            .send({EmailUser: valor,  PasswordUser:"test"} )    
            .expect('Content-Type', /json/)
                .end( function(err,res){
                  token=res.body.token
                 expect(res).to.have.status(200);
                 done();
                });  
            });

            it('should get a single user_email record',  function(done){                      
                request.get('/api/users/email/test@xxx.com')
                .set('Authorization', token)
                 .expect('Content-Type', /json/)
                 .end( function(err,res){
                     id=res.body.data._id
                     expect(res).to.have.status(200);
                     done();
                    });          
                 });   
        
        it('Should return json as default data format', function(done){
            request.get('/api/users/')      
            .set('Authorization', token)
            .expect('Content-Type', /json/)
            .end( function(err,res){
                expect(res.body.message).to.equals("Users retrieved successfully");   
                expect(res.body.status).to.equals("success");  
                expect(res).to.have.status(200);
                done();
               });  
        });
 
                    


        it('should get a single user id record', function(done) {   
            request.get('/api/users/'+`${id}`)  
            .set('Authorization', token)
            .end( function(err,res){         
                expect(res).to.have.status(200);
                done();
               });  
                 }); 

                 
        it('should get a single user id record', function(done) {   
            request.get('/api/users/'+`${idtest}`)  
            .set('Authorization',  token)
            .end( function(err,res){         
                expect(res).to.have.status(404);
                done();
               });  
                 }); 


               
    

                });  //end la funcion users  GET


                describe('PUT', function(){
                    let id = "";
                    let token="";

                    it('Should  login', function(done){
                    request.post('/api/login')
                    .send({EmailUser: "test@xxx.com",  PasswordUser:"test"} )    
                    .expect('Content-Type', /json/)
                        .end( function(err,res){                   
                          token=res.body.token          
                         expect(res).to.have.status(200);
                         done();
                        });  
                    });

                    it('should get a single user_email record', (done) => {                      
                        //  request.get('api/users/email'+`/${valor}`) 
                          request.get('/api/users/email/test@xxx.com')
                          .set('Authorization', token)
                           .expect('Content-Type', /json/)
                           .end( function(err,res){
                               id=res.body.data._id
                               done();
                              });          
                           });  


                    
                it('Should  update json users', function(done){      
                   request.put('/api/users'+`/${id}`)
                   .set('Authorization', token)
                   .send(
                    {
                        NameUser: "test4",
                        LastNameUser: "test4",
                        EmailUser: "test@xxx.com",
                        StatusUser: true,
                        PasswordUser:"test",
                        DateBeginUser: ""      
                    }
                
                   )    
                   .end( function(err,res){                  
                    console.log(res.body.data)
                   expect(res).to.have.status(200);
                   done();
                  }); 
                });
                

                it('Should not update  json incomplete', function(done){                               
                    request.put('/api/users'+`/${id}`)
                    .set('Authorization',token)
                    .send(
                        {
                            NameUser: "test4",
                            LastNameUser: "",
                            EmailUser: "test@xxx.com",
                            StatusUser: true                    
                        }
                    
                     )
                    .end( function(err,res){
                       expect(res.body.message).to.equals("users is not defined");  
                       expect(res).to.have.status(500);
                       done();
                      });  
                });

                it('Should  not update  id user is empty', function(done){                               
                    request.put('/api/users/')
                    .set('Authorization',token)
                    .send(
                        {
                            NameUser: "test4",
                            LastNameUser: "test4",
                            EmailUser: "test@xxx.com",
                            StatusUser: true,
                            PasswordUser:"test",
                            DateBeginUser: ""             
                        }                 
                     )
                    .end( function(err,res){
                       expect(res.body.message).to.equals("Not Found");  
                       expect(res).to.have.status(404);
                       done();
                      });  
                });

                it('Should  update 500 json users', function(done){                               
                    request.put('/api/users/45')
                    .set('Authorization',token)
                    .send(
                        {
                            NameUser: "test4",
                            LastNameUser: "test4",
                            EmailUser: "test@xxx.com",
                            StatusUser: true,
                            PasswordUser:"test",
                            DateBeginUser: ""             
                        }                 
                     )
                    .end( function(err,res){
                       expect(res.body.message).to.equals("User not found with id 45");  
                       expect(res).to.have.status(404);
                       done();
                      });  
                });
                
                });  //end la funcion users  put

                describe('delete', function(){                              
                    let id = "";
                    let token="";

                    it('Should  login', function(done){
                    request.post('/api/login')
                    .send({EmailUser: "test@xxx.com",  PasswordUser:"test"} )   
                    .expect('Content-Type', /json/)
                        .end( function(err,res){
                          token=res.body.token
                         expect(res).to.have.status(200);
                         done();
                        });  
                    });
                
                    it('should get a single user_email record', (done) => {                      
                          request.get('/api/users/email/test@xxx.com')
                          .set('Authorization', token)
                           .expect('Content-Type', /json/)
                           .end( function(err,res){
                               id=res.body.data._id
                               done();
                              });          
                           }); 

                           it('Should  remove json users', function(done){
                            request.delete('/api/users'+`/${id}`)
                            .set('Authorization',  token)
                            .expect('Content-Type', /json/)
                            .end( function(err,res){
                                expect(res.body.message).to.equals("User deleted successfully!");   
                                expect(res.body.status).to.equals("success");   
                                expect(res).to.have.status(200);
                                done();
                               });          
                            }); 

                            it('Should no remove json with idusers  format ', function(done){
        
                                request.delete('/api/users/1')
                                .set('Authorization', token)
                                .expect('Content-Type', /json/)
                              
                                .end( function(err,res){
                                    expect(res.body.message).to.equals("can not delete User with id 1");  
                                    expect(res.body.data.name).to.equals("CastError");  
                                    expect(res).to.have.status(404);
                                    done();
                                   }); 
                              });

                              it('Should not  remove json users with id no existe', function(done){        
                                request.delete('/api/users'+`/${id}`)
                                .set('Authorization', token)
                                .expect('Content-Type', /json/)
                                .end( function(err,res){
                                    expect(res.body.message).to.equals("Could not delete User with id "+" "+`${id}`);  
                                    expect(res).to.have.status(404);
                                    done();
                                   }); 
                              });


                              it('Should not  remove json users id null', function(done){        
                                request.delete('/api/users/')
                                .set('Authorization', token)
                                .expect('Content-Type', /json/)
                                .end( function(err,res){
                                    expect(res.body.message).to.equals("Not Found");   
                                    expect(res).to.have.status(404);
                                    done();

                                   });   
                              });


                                  });  // //la funcion users  DELETE

                        

});

