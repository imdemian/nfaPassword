var admin = require("firebase-admin");
var keys = require("../serviceAccountsKey.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var db=admin.firestore();
var conexion=db.collection("miejemplo1");
var conexionp=db.collection("miejemplo2");



module.exports={conexion,conexionp}