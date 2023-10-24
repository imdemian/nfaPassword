var ruta=require("express").Router();
var {subirArchivoP}=require("../middlewares/middlewares");
const conexionp = require("../bd/conexion");
var { mostrarProductos, buscarID, nuevoProducto, modificarProducto, borrarProducto }=require("../bd/productoBD");


ruta.get("/api/mostrarproductos",async(req,res)=>{
    var productos=await mostrarProductos();
    if(productos.length==0){
       res.status(400).json("No hay productos");
    }else{
       res.status(200).json(productos);
    }
 
 });
 
 
 ruta.post("/api/nuevoproducto", subirArchivoP(), async(req,res)=>{
      req.body.foto=req.file.originalname;
    var error=await nuevoProducto(req.body);
    if(error==0){
       res.status(200).json("Producto registrado correctamente");
    }else{
       res.status(400).json("Erro al registrar el producto");
    }
 });
 
 ruta.get("/api/buscarProductoPorId/:id",async(req,res)=>{
    var user=await buscarID(req.params.id);
    if(user==""){
       res.status(400).json("producto no encontrado");
    }else{
       res.status(200).json(user);
    }
 });
 
 ruta.post("/api/editarProducto",subirArchivoP(),async(req,res)=>{
      req.body.foto=req.file.originalname;
    var error=await modificarProducto(req.body);
    if(error==0){
       res.status(200).json("Producto actualizado correctamente");
    }else{
       res.status(400).json("Error al actualizar el Producto");
    }
 });
 
 ruta.get("/api/borrarProducto/:id",async(req,res)=>{
    var error=await borrarProducto(req.params.id);
    if(error==0){
       res.status(200).json("Producto borrado");
    }else{
       res.status(400).json("Error al borrar el Producto")
    }
 });
 module.exports=ruta;