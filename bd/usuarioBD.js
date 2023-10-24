var conexion = require("./conexion").conexion;
var fs = require('fs').promises;
const { generarPassword, validarPassword } = require("../middlewares/password");
var Usuario=require("../modelos/Usuario");

async function mostrarUsuarios() {
    var users=[];
    try{
        var usuarios=await conexion.get();
        usuarios.forEach((usuario)=>{
             var usuario1= new Usuario(usuario.id,usuario.data());
             if(usuario1.bandera==0){
                 users.push(usuario1.obtenerUsuario);
             }
        });
    }catch(err){
        console.log("Error al obtener los usuarios de firebase "+err);
        users.push(null);
    }
    return users;
}

async function buscarID(id){
    var user;
    try{
        var usuariobd=await conexion.doc(id).get();
        var usuarioObjeto=new Usuario(usuariobd.id, usuariobd.data());
        if(usuarioObjeto.bandera==0){
            user=usuarioObjeto.obtenerUsuario;
        }
    }catch(err){
        console.log("Error al buscar al usuario"+err);
        user = null;
    }
    return user;
}

async function nuevoUsuario(datos){
     var{salt,hash}=generarPassword(datos.password);
     datos.password=hash;
     datos.salt=salt;
    datos.admin=false;
    var usuario=new Usuario(null,datos);
    var error=1;
    if(usuario.bandera==0){
        try{
            await conexion.doc().set(usuario.obtenerUsuario);
            console.log("Usuario registrado Correctamente");
            error=0;
        }catch(err){
            console.log("Error al registrar el usuario"+err);
        }
    }
    return error;
}

async function modificarUsuario(datos){
     var usuario=await buscarID(datos.id);
     var error=1;
     if(usuario!=undefined){
        if(datos.password==""){
            datos.password=user.password;
            datos.salt=user.salt;
        }else{
            var{salt,hash}=generarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        var fotoRuta = './web/Usuarios/images/' + usuario.foto;
        await fs.unlink(fotoRuta);  
        var usuario= new Usuario(datos.id,datos)
        if(usuario.bandera==0){
            try{
                await conexion.doc(usuario.id).set(usuario.obtenerUsuario);
                console.log("Usuario registrado Correctamente");
                error=0;
            }catch(err){
                console.log("Error al modificar usuario"+err);
            }
        }else{
            console.log("Los datos no son correctos");
        }
     }
    return error;
}

async function borrarUsuario(id){
    var error=1;
    var user=await buscarID(id);
    if(user!=undefined){
        try{
            var fotoRuta = './web/Usuarios/images/' + user.foto;
            await fs.unlink(fotoRuta); 
            await conexion.doc(id).delete();
            console.log("Usuario eliminado correctamente");
            error=0;
        }catch(err){
            console.log("Error al borrar usuario"+err);
        }
    }
    return error;
}

async function login(datos){
    var user = undefined;
    var usuarioObjeto;
    try{
        var usuarios = await conexion.where('usuario','=',datos.usuario).get();
        if(usuarios.docs.length==0){
            return undefined;
        } 
        usuarios.docs.filter((doc)=>{
            var validar = validarPassword(datos.password,doc.data().password,doc.data().salt);
            if(validar){
                usuarioObjeto = new Usuario(doc.id,doc.data());
                if(usuarioObjeto.bandera==0){
                    user=usuarioObjeto.obtenerUsuario;
                }
            }
            else 
                return undefined;
        });
    }
    catch(err){
        console.log("Error al recuperar al usuario: "+ err);
    }
    return user;
}

module.exports={
    mostrarUsuarios,
    modificarUsuario,
    borrarUsuario,
    buscarID,
    nuevoUsuario,
    login
}