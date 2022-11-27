//import helper response formatter
const { response} = require('../helpers/response.formatter');

//import model admin
const { Admin, Item } = require('../models');

//validasi
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {

    //membuat item
    createItem : async (req,res) => {
        try {
            
            //membuat schema untuk validasi
            const schema = {
                item_name: {
                    type: "string",
                    min: 1,
                }
            }

            //buat object item
            let itemCreateObj = {
                admins_id: data.adminId,
                item_name: req.body.item_name,
            }

            //validasi menggunakan module fastest-validator
            const validate = v.validate(itemCreateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //buat item
            let itemCreate = await Item.create(itemCreateObj);

            //response menggunakan helper response.formatter
            res.status(201).json(response(201, 'success create item', itemCreate));
        }catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    },

    //mendapatkan semua data item
    getItem : async (req,res) => {
        try {
            //mendapatkan data semua item
            let itemGets = await Item.findAll({
                include : {
                    model : Admin,
                }
            });

        //response menggunakan helper response.formatter
        res.status(200).json(response(200,'success get item', itemGets));

        } catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    },

    //mendapatkan data item berdasarkan id
    getItemById : async (req,res) => {
        try{
            //mendapatkan data item berdasarkan id
            let itemGet = await Item.findOne({
                where : {
                    id : req.params.id
                },
                //menampilkan admin yang membuat item, karena kita sudah membuat relasi 
                include : {
                    model : Admin,
                }
            });

            //cek jika item tidak ada
            if(!itemGet){
                res.status(404).json(response(404,'item not found'));
                return;
            }

            //cek apakah admin yang akses adalah yang membuat itemnya
            if(itemGet.admins_id != data.adminId){
                res.status(403).json(response(403,'youre not owner of this item'));
                return;
            }

            //response menggunakan helper response.formatter
            res.status(200).json(response(200,'success get item by id', itemGet));
        }catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    },

    //mengupdate item berdasarkan id
    updateItem : async (req, res) => {
        try {
            //mendapatkan data item untuk pengecekan
            let itemGet = await Item.findOne({
                where:{
                    id : req.params.id
                }
            })

            //cek apakah data item ada
            if(!itemGet){
                res.status(404).json(response(404,'item not found'));
                return;
            }

            //cek apakah admin yang akses adalah yang membuat itemnya
            if(itemGet.admins_id != data.adminId){
                res.status(403).json(response(403,'youre not owner of this item'));
                return;
            }

             //membuat schema untuk validasi
            const schema = {
                item_name: {
                    type: "string",
                    min: 1,
                }
            }

             //buat object item
            let itemUpdateObj = {
                item_name: req.body.item_name,
            }

            //validasi menggunakan module fastest-validator
            const validate = v.validate(itemUpdateObj, schema);
            if (validate.length > 0) {
                res.status(400).json(response(400, 'validation failed', validate));
                return;
            }

            //update item
            await Item.update(itemUpdateObj, {
                where:{
                    id: req.params.id,
                    admins_id: data.adminId,
                }
            })

            //mendapatkan data item setelah update
            let itemAfterUpdate = await Item.findOne({
                where:{
                    id: req.params.id,
                    admins_id: data.adminId,
                }
            })

            //response menggunakan helper response.formatter
            res.status(200).json(response(200,'success update item', itemAfterUpdate));
            
        } catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }   
    },

    //menghapus item berdasarkan id
    deleteItem: async (req, res) => {
        try {

            //mendapatkan data item untuk pengecekan
            let itemGet = await Item.findOne({
                where:{
                    id : req.params.id
                }
            })

            //cek apakah data item ada
            if(!itemGet){
                res.status(404).json(response(404,'item not found'));
                return;
            }

            //cek apakah admin yang akses adalah yang membuat itemnya
            if(itemGet.admins_id != data.adminId){
                res.status(403).json(response(403,'youre not owner of this item'));
                return;
            }

            await Item.destroy({
                where:{
                    id: req.params.id,
                    admins_id: data.adminId,
                }
            })

            //response menggunakan helper response.formatter
            res.status(200).json(response(200,'success delete item'));

        } catch (err) {
            res.status(500).json(response(500,'internal server error', err));
            console.log(err);
        }
    }
}