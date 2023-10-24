var ruta=require("express").Router();
var{autorizado,admin}=require("../middlewares/password");
var {subirArchivoP}=require("../middlewares/middlewares");
const conexionp = require("../bd/conexion");
var { mostrarProductos, buscarID, nuevoProducto, modificarProducto, borrarProducto }=require("../bd/productoBD");

ruta.get("/",async(req,res)=>{
    var productos=await mostrarProductos();
    console.log(productos);
    res.render("productos/mostrar",{productos});
 });


 ruta.get("/nuevoproducto",(req,res)=>{
    res.render("productos/nuevo");
 });
 
 ruta.post("/nuevoproducto",admin, subirArchivoP(), async(req,res)=>{
   req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/productos");
 });
 
 ruta.get("/editarproducto/:id",async(req,res)=>{
    var prod = await buscarID(req.params.id);
    res.render("productos/modificar",{prod});
 });
 
 ruta.post("/editarproducto", subirArchivoP(), async(req,res)=>{
   req.body.foto=req.file.originalname;
   var error = await modificarProducto(req.body);
    res.redirect("/productos");
 });
 
 ruta.get("/borrarproducto/:id",async(req,res)=>{
    try{
       await borrarProducto(req.params.id);
       res.redirect("/productos");
    }catch(err){
       console.log("Error al borrar el producto"+err);
    }
 });

module.exports=ruta;