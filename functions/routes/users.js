const router = require('express').Router();
var firebase = require('firebase');
var db = firebase.firestore();


router.get('/users/sigin', (req, res) => {
    res.render('users/sigin');
})

router.post('/users/sigin', (req, res) => {
  const {email, password} = req.body;
  firebase.auth().languageCode = 'es';
  //firebase.auth().useDeviceLanguage();
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(User){
    const user = User.user;
     res.redirect('/menu/lista');
 }).catch(function(error){
     res.render('users/sigin', {error: error.message});
 });
})

router.get('/users/sigup', async(req, res) => {
  var giro = [];
  await db.collection('giro').get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      var datos = {
        key: doc.id,
        value: doc.data().giro
      }
        giro.push(datos);
    })
    res.render('users/sigup', {giro: giro});
  }).catch(function(error){
    res.render('users/sigup', {error: 'Error al consultar giros de la empresa'});
  });

})

router.post('/users/sigup', async(req, res) => {
  var errores = [];
  var {nombreComercio, giroComercio, calle, noExterior, noInterior, telefono, cp, colonia,
    ciudad, estado, nombre, apPaterno, apMaterno, email, password, passwordConfirm } = req.body;

   errores = validarRegistro(nombreComercio, giroComercio, calle, noExterior, telefono, cp, colonia,
    ciudad, estado, nombre, apPaterno, apMaterno, email, password, passwordConfirm);

    if(errores.length > 0){
      var giro = [];
      await db.collection('giro').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            if(doc.data().giro == giroComercio)
            {
              var datos = {
                key: doc.id,
                value: doc.data().giro,
                selected: 'selected'
              }
            } else {
              var datos = {
                key: doc.id,
                value: doc.data().giro,
                selected: ''
              }
            }
            
            giro.push(datos);
          })
          res.render('users/sigup', {giro: giro, errores, nombreComercio, giroComercio, calle, noExterior, noInterior, telefono, cp, colonia, ciudad, estado, nombre, apPaterno, apMaterno, email });
        }).catch(function (error) {
          res.render('users/sigup', { error: error});
        });
     } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(User){
        agregarComercio(User.user.uid, nombreComercio, giroComercio,calle, noExterior, noInterior,  telefono, cp,colonia, ciudad, estado, nombre, apPaterno, apMaterno);
        logOut();
        res.render('users/sigin', {success: 'Regitro Correcto por favor inicia sessión'});
      })
      .catch(function(error) {
        res.render('users/sigin', {error: error.message});
      });
     }
})

router.get('/salir', (req, res) => {
    firebase.auth().signOut().then(function() {
        res.redirect('/');
      }).catch(function(error) {
        res.send(error)
      });
})

router.get('/users/buscarColonias/:cp', (req,res) => {
  var cp = req.params.cp;
  
  var cityRef = db.collection('colonias').doc(cp);
  var getDoc = cityRef.get()
    .then(doc => {
      if (!doc.exists) {
       res.send("No se encontro nada");
      } else {
        var colonias = doc.data();
       res.json( colonias); 
      }
    })
    .catch(err => {
     res.send(err);
      console.log('Error getting document', err);
      
    });
 })


function validarRegistro(nombreComercio, giroComercio, calle, noExterior, telefono, cp, colonia,
  ciudad, estado, nombre, apPaterno, apMaterno, email, password, passwordConfirm) {
    var errores = [];

    if(nombreComercio.length == 0){
      errores.push({text:'Nombre del Comercio es requerido'});
    }
    if(giroComercio.length == 0) {
      errores.push({text: 'Selecciona un giro para tu comercio'});
    }
    if(calle.length == 0) {
      errores.push({text:'Calle es requerido'});
    }
    if(noExterior.length == 0){
      errores.push({text:'Numero exterior es requerido'});
    }
    if(telefono.length !== 10) {
      errores.push({text:'El numero de telefono debe tener 10 digitos'});
    }
     if(cp.length !== 5){
       errores.push({text:'Ingresa un codigo postal valido de 5 digitos'});
     }
     if(colonia.length == 0) {
       errores.push({text:'Selecione una colonia'});
    }
     if(ciudad.length == 0){
      errores.push({text:'Seleccione una ciudad'});
    }
    if(estado.length == 0){
      errores.push({text:'Seleccione un estado'});
    }
    if(nombre.length == 0){
      errores.push({text:'El nombre es requerido'});
    }
    if(apPaterno.length == 0){
      errores.push({text:'El apellido paterno es requerido'});
    }
    if(apMaterno.length == 0){
      errores.push({text:'El apellido materno es requerido'});
    }
    emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;
    if (!emailRegex.test(email)){
      errores.push({text:'Agregue un email valido'});
    }
    if( password.length <6){
      errores.push({text:'La contraseña debe tener minimo 6 caracteres'});
    }
    if( password != passwordConfirm){
      errores.push({text:'Las constraseñas no coinciden'});
    }
    return errores;
  }

  function agregarComercio(id, nombreComercio, giroComercio,calle, noExterior, noInterior, telefono, cp, colonia, ciudad, estado, nombre, apPaterno, apMaterno) {
    db.collection("comercioUsers").doc(id).set({
      nombre: nombre,
      apPaterno: apPaterno,
      apMaterno: apMaterno,
      telefono:telefono,
      nombreComercio: nombreComercio,
      giroComercio: giroComercio,
      calle: calle,
      noExterior: noExterior,
      noInterior: noInterior,
      cp: cp,
      colonia: colonia,
      ciudad: ciudad,
      estado: estado
  })
  .then(function() {
      return;
  })
  .catch(function(error) {
      return; 
  });
  }

  function logOut(){
    firebase.auth().signOut().catch(function(error) {
      res.send(error);
    });
  }

module.exports = router;
