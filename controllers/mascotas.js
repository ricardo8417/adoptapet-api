/*  Archivo controllers/mascotas.js
 *  Simulando la respuesta de objetos Mascota
 *  en un futuro aquí se utilizarán los modelos
 */
/*const Mascota = require('../models/Mascota')
function crearMascota(req, res) {
  // Instanciaremos un nuevo usuario utilizando la clase usuario
  var mascota = new Mascota(req.body)
  res.status(201).send(mascota)
}*/
const mongoose = require('mongoose')
const Mascota = mongoose.model('Mascota')


function crearMascota(req, res, next) {
    var mascota = new Mascota(req.body)
    mascota.anunciante = req.usuario.id
    mascota.estado = 'disponible'
    mascota.save().then(mascota => {
        res.status(201).send(mascota)
    }).catch(next)
}
/*function obtenerMascotas(req, res) {
  // Simulando dos Mascotas y respondiendolos
  var mascota1 = new Mascota(1, 'Nochipa', 'Perro', 'https://www.perrosrazapequeña.com/wp-content/uploads/2018/06/chihuahua-pelo-largo.jpg','bien bonita','1','CDMX');
  var mascota2 = new Mascota(1, 'Tito', 'Tortuga', 'https://img.culturacolectiva.com/featured/2019/02/27/1551305058738/tortugas-japonesas-se-vuelven-plaga-en-mexico-high.png','verde','1','CDMX');
  res.send([mascota1, mascota2])
}*/
function obtenerMascotas(req, res, next) {
    if (req.params.id) {
        Mascota.findById(req.params.id)
            .populate('anunciante', 'username nombre apellido bio foto').then(mascotas => {
                res.send(mascotas)
            }).catch(next)
    } else {
        Mascota.find().then(mascotas => {
            res.send(mascotas)
        }).catch(next)
    }
}

function obtenerMascota(req, res) {
    // Simulando dos Mascotas y respondiendolos
    var mascota1 = new Mascota(1, 'Nochipa', 'Perro', 'https://www.perrosrazapequeña.com/wp-content/uploads/2018/06/chihuahua-pelo-largo.jpg', 'bien bonita', '1', 'CDMX');
    res.send(mascota1)
}

function modificarMascota(req, res, next) {
    Mascota.findById(req.params.id).then(mascota => {
        //Buscando por id a la mascota
        if (!mascota) { return res.sendStatus(401); }
        let IDUser = req.usuario.id;
        let IDAnunciante = mascota.anunciante;
        //Si  no encuentra la mascota arroja 401 y declara que usuario es igual a anaunciante, si son iguales  modifica los datos, sino m>
        if (IDUser == IDAnunciante) {
            let nuevaInfo = req.body
            if (typeof nuevaInfo.nombre !== 'undefined')
                mascota.nombre = nuevaInfo.nombre
            if (typeof nuevaInfo.categoria !== 'undefined')
                mascota.categoria = nuevaInfo.categoria
            if (typeof nuevaInfo.fotos !== 'undefined')
                mascota.fotos = nuevaInfo.fotos
            if (typeof nuevaInfo.descripcion !== 'undefined')
                mascota.descripcion = nuevaInfo.descripcion
            if (typeof nuevaInfo.anunciante !== 'undefined')
                mascota.anunciante = nuevaInfo.anunciante
            if (typeof nuevaInfo.ubicacion !== 'undefined')
                mascota.ubicacion = nuevaInfo.ubicacion
            if (typeof nuevaInfo.estado !== 'undefined')
                mascota.estado = nuevaInfo.estado
            mascota.save().then(updatedMascota => { //Guardando mascota modificada en MongoDB.
                res.status(201).json(updatedMascota.publicData())
            }).catch(next)
        } else {
            return res.sendStatus(401);
        }
    }).catch(next)
}


//     var mascota1 = new Mascota(req.params.id, 'Nochipa', 'Perro', 'https://www.perrosrazapequeña.com/wp-content/uploads/2018/06/chihuahua-pelo-largo.jpg', 'bien bonita', '1', 'CDMX');
//     var modificaciones = req.body
//     mascota1 = {...mascota1, ...modificaciones }
//     res.send(mascota1)
// }

function eliminarMascota(req, res) {
    Mascota.findById(req.params.id).then(mascota => {
        if (!mascota) { return res.sendStatus(404); }
        //  Si mascota no es verdadero mandar 404 que es NOT FOUND, declarar que id usuario= id anunciante
        let IDUser = req.usuario.id;
        let IDAnunciante = mascota.anunciante;
        if (IDUser == IDAnunciante) {
            let nombreMascota = mascota.nombre;
            mascota.deleteOne();
            res.status(200).send(`${nombreMascota} ${req.params.id} ha sido eliminado de Mascotas`);
        } else {
            return res.sendStatus(404);
        }
    });
}
module.exports = {
    crearMascota,
    obtenerMascotas,
    modificarMascota,
    eliminarMascota,
    obtenerMascota
}