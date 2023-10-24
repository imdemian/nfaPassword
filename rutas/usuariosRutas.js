var ruta=require("express").Router();
var {subirArchivoU}=require("../middlewares/middlewares");
var{autorizado}=require("../middlewares/password");
const conexion = require("../bd/conexion");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarID, borrarUsuario, login}=require("../bd/usuarioBD");

ruta.get("/", autorizado,async(req,res)=>{
   var usuarios=await mostrarUsuarios();
   console.log(usuarios);
   res.render("usuarios/mostrar",{usuarios});
});

ruta.get("/nuevousuario",(req,res)=>{
   res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario", subirArchivoU(), async(req,res)=>{
   req.body.foto=req.file.filename;
   var error=await nuevoUsuario(req.body);
   res.redirect("/");
});


ruta.get("/editarusuario/:id",async(req,res)=>{
   var user=await buscarID(req.params.id);   
   res.render("usuarios/modificar",{user});
});

ruta.post("/editarusuario",subirArchivoU(), async(req,res)=>{
   if(req.file!=null){
   req.body.foto=req.file.filename;
   }else{
   req.body.foto=req.body.fotoAnterior;
   }
   var error=await modificarUsuario(req.body);
   res.redirect("/");
});

ruta.get("/borrarusuario/:id",async(req,res)=>{
   try{
      await borrarUsuario(req.params.id);
      res.redirect("/");
   }catch(err){
      console.log("Error al borrar el usuario"+err);
   }
});

ruta.get("/login",(req,res)=>{
   res.render("usuarios/login")
});

ruta.post("/login",async(req,res)=>{
   var user=await login(req.body);
   if(user==undefined){
      res.redirect("/login");
   }else{
      if(user.admin){
         console.log("Administrador");
         req.session.admin=req.body.usuario;
         res.redirect("/productos/nuevoProducto");
      }else{
         console.log("Usuario");
         req.session.usuario=req.body.nombre;
         res.redirect("/");
      }
   }
});

ruta.get("/logout",(req,res)=>{
   req.session=null;
   res.redirect("/login");
});

module.exports=ruta;