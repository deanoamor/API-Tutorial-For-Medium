//import controller admin.controller.js 
const adminController = require('../controllers/admin.controller');

//import middleware dari auth.middleware.js
const mid = require('../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

//import multer untuk mngehandle input dari form data
const multer = require('multer');
const upload = multer();


//membuat admin baru route
route.post('/admin/register', //route
[upload.array()], //middleware
adminController.createAdmin); //controller

//login admin route
route.post('/admin/login', //route
[upload.array()], //middleware
adminController.loginAdmin); //controller

//logout admin route
route.post('/admin/logout', //route
[ mid.isLogin, mid.isLogout ,upload.array()], //middleware isLogin dan isLogout digunakan untuk mengecek apakah admin sudah login atau belum atau sudah logout atau belum
adminController.logoutAdmin); //controller

module.exports = route;

