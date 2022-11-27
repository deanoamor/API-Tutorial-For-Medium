//import helper response formatter
const { response} = require('../helpers/response.formatter');

//import model admin
const { Admin, Token } = require('../models');

//import config
const baseConfig = require('../config/base.config');

//hash password
const passwordHash = require('password-hash');

//import jwt dengan jsonwebtoken
const jwt = require('jsonwebtoken');

//validasi
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {

    //membuat admin baru
    createAdmin : async (req,res) => {
        try{

            //membuat schema untuk validasi
            const schema = {
                name :{
                    type : "string",
                    min : 3,
                },
                email :{
                    type : "email",
                    min : 3,
                },
                password :{
                    type : "string",
                    min : 3,
                }
            };

            //validasi menggunakan module fastest-validator
            const validate = v.validate({
                name : req.body.name,
                email : req.body.email,
                password : req.body.password,
            }, schema);
            if(validate.length > 0){
                res.status(400).json(response(400,'validation failed', validate));
                return;
            }

            //mendapatkan data admin untuk pengecekan
            let adminGets = await Admin.findOne({ //kita menggunakan model Admin
                    where : {
                        email : req.body.email
                    }
                }
            );

            //cek apakah email sudah terdaftar
            if(adminGets){
                res.status(409).json(response(409,'email already registered'));
                return;
            }

            //membuat object untuk create admin
            let adminCreateObj = {
                name : req.body.name,
                email : req.body.email,
                password : passwordHash.generate(req.body.password), //hash password menggunakan module password-hash
            }

            //membuat admin baru
            let adminCreate = await Admin.create(adminCreateObj);

            //mengirim response dengan bantuan helper response.formatter
            res.status(201).json(response(201,'admin created', adminCreate)); //response(201,'admin created', adminCreate) adalah helper response.formatter

        }catch(err){
            res.status(500).json(response(500,'internal server error',err));
            console.log(err);
        }
    },

    //login admin
    loginAdmin : async (req,res) => {
        try{

            //membuat schema untuk validasi
            const schema = {
                email :{
                    type : "email",
                    min : 3,
                },
                password :{
                    type : "string",
                    min : 3,
                }
            };

            //memasukan req.body ke dalam variable
            let email = req.body.email;
            let password = req.body.password;

            //validasi menggunakan module fastest-validator
            const validate = v.validate({
                email : email,
                password : password,
            }, schema);
            if(validate.length > 0){
                res.status(400).json(response(400,'validation failed', validate));
                return;
            }

            //mendapatkan data admin untuk pengecekan
            let adminGets = await Admin.findOne({ //kita menggunakan model Admin
                    where : {
                        email : email
                    }
            });

            //cek apakah email ada
            if(!adminGets){
                res.status(404).json(response(404,'email not found'));
                return;
            }

            //check password
            if(!passwordHash.verify(password, adminGets.password)){
                res.status(403).json(response(403,'password wrong'));
                return;
            }

            //membuat token jwt
            let token = jwt.sign({
                adminId: adminGets.id, //kita parsing id admin
            }, baseConfig.auth_secret, { //auth secret adalah secret key yang kita buat di config/base.config.js
                expiresIn: 86400 // expired dalam 24 jam
            });

            //mengirim response dengan bantuan helper response.formatter
            res.status(200).json(response(200,'login success', {token : token})); 

        }catch(err){
            res.status(500).json(response(500,'internal server error',err));
            console.log(err);
        }
    },

    //logout admin
    logoutAdmin : async (req,res) => {
        try{
             //memasukan token kedalam variable
            let token = req.headers.authorization.split(' ')[1];

            //memasukan token ke table token
            let tokenInsert = await Token.create({
                token: token
            });

            //send response
            res.status(200).json(response(200,'logout success', tokenInsert));
        }catch(err){
            res.status(500).json(response(500,'internal server error',err));
            console.log(err);
        }
    }

}