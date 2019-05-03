const router = require('express').Router();
var firebase = require('firebase');
const { isAuthenticated} = require('../helper/Auth');
var db = firebase.firestore();
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/imag'),
    filename:  (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const uploadImage = multer({
    storage,
    limits: {fileSize: 1000000}
}).single('image');

//const storage = new Storage();
bucketName = 'debalazo-maqueta.appspot.com';

router.get('/menu/agregar', isAuthenticated, (req,res) => {
    /*var nombre = req.user.displayName;
    var user = req.user;*/
    res.render('Menu/AltaMenu'/*, {user: user, nombre:nombre}*/);
});

router.post('/menu/agregar', isAuthenticated, (req,res) => {
    // var {imgProducto, Titulo, Precio, DifPorc, chkCh, txtCh, chkMed, txtMed, chkGde, txtGde, Descripcion } = req.body;
    // uploadImage(req, res, (err) => {
    //     if (err) {
    //         err.message = 'The file is so heavy for my service';
    //         return res.send(err);
    //     }
    //     console.log(req.file);
    //     res.send('uploaded');
    // });

     res.render('menu/ListaMenu');

    // storage
    //     .bucket(bucketName)
    //     .upload(imagen)
    //     .then(() => {
    //       console.log(` uploaded to ${bucketName}.`);
    //     })
    //     .catch(err => {
    //       console.error('ERROR:', err);
    //     });

    //     res.render('Menu/ListaMenu');
    // db.collection("productos").add({
    //     UserId: id,
    //     imagen: id+imgProducto,
    //     titulo: Titulo,
    //     descripcion: Descripcion,
    //     precio: Precio == null ? '' : Precio,
    //     chico: txtCh == null ? '' : txtCh,
    //     mediano: txtMed == null ? '' : txtMed,
    //     grande: txtGde == null ? '' : txtGde

    // })
    // .then(function() {
    //     storage
    //     .bucket(bucketName)
    //     .upload(file)
    //     .then(() => {
    //       console.log(`${imgProducto} uploaded to ${bucketName}.`);
    //     })
    //     .catch(err => {
    //       console.error('ERROR:', err);
    //     });
    // })
    // .catch(function(error) {
    //     res.render('menu/ListaMenu', {error: error.message});
    // });

});

router.get('/menu/lista', isAuthenticated,  (req,res ) => {
    //var nombre = req.user.displayName;
    //var user = req.user;
    res.render('Menu/ListaMenu'/*, {user: user, nombre:nombre}*/);
});


router.post('/menu', isAuthenticated,  (req,res) => {
    /*var nombre = req.user.displayName;
    var user = req.user;*/
   //const {Titulo, Precio, Descripcion, AgregarImagen} = req.body;

//    db.collection("Menu").add({
//     Titulo: Titulo,
//     Precio: Precio,
//     Descripcion: Descripcion,
//     Imagen: AgregarImagen
// })
// .then(function(docRef) {
//     var nombre = req.user.displayName;
//     var user = req.user;
//      res.render('Menu/AltaMenu', {user: user, nombre:nombre});


// })
// .catch(function(error) {
//     // console.error("Error adding document: ", error);
//     res.send(error);
// });
    res.render('/menu')

});


module.exports = router;