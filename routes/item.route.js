//import controller admin.controller.js 
const itemController = require('../controllers/item.controller');

//import middleware dari auth.middleware.js
const mid = require('../middlewares/auth.middleware');

//express
const express = require('express');
const route = express.Router();

//import multer untuk mngehandle input dari form data
const multer = require('multer');
const upload = multer();

//membuat item baru route
route.post('/admin/item/create', //route
[mid.isLogin, mid.isLogout, upload.array()], //middleware
itemController.createItem); //controller

//mendapatkan semua data item route
route.get('/admin/item/get', //route
[mid.isLogin, mid.isLogout, upload.array()], //middleware
itemController.getItem); //controller

 //melihat data item berdasarkan id route
route.get('/admin/item/get/:id', //route
[mid.isLogin, mid.isLogout, upload.array()], //middleware
itemController.getItemById); //controller

 //mengupdate item berdasarkan id route
 route.put('/admin/item/update/:id', //route
 [mid.isLogin, mid.isLogout, upload.array()], //middleware
 itemController.updateItem); //controller

 //menghapus item berdasarkan id route
 route.delete('/admin/item/delete/:id', //route
 [mid.isLogin, mid.isLogout, upload.array()], //middleware
 itemController.deleteItem); //controller

module.exports = route;
