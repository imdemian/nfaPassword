var conexion = require("./conexion").conexionp;
var fs = require('fs').promises;
var Producto=require("../modelos/Producto");

async function mostrarProductos() {
    var prods=[];
    try{
        var productos=await conexion.get();
        productos.forEach((producto)=>{
             //var usuario1=new Usuario
             var producto1= new Producto(producto.id,producto.data());
             if(producto1.bandera==0){
                 prods.push(producto1.obtenerProducto);
             }
        });
    }catch(err){
        console.log("Error al obtener los productos de firebase "+err);
        prods.push(null);
    }
    return prods;
}

async function buscarID(id){
    var prod;
    try{
        var producto=await conexion.doc(id).get();
        var productoObjeto=new Producto(producto.id, producto.data());
        if(productoObjeto.bandera==0){
            prod=productoObjeto.obtenerProducto;
        }
    }catch(err){
        console.log("Error al buscar al producto"+err);
        prod = null;
    }
    return prod;
}

async function nuevoProducto(datos){
    var producto=new Producto(null,datos);
    var error=1;
    if(producto.bandera==0){
        try{
            await conexion.doc().set(producto.obtenerProducto);
            console.log("Producto registrado Correctamente");
            error=0;
        }catch(err){
            console.log("Error al registrar el producto"+err);
        }
    }
    return error;
}

async function modificarProducto(datos){
    var producto=await buscarID(datos.id);
    var error=1;
    if(producto!=undefined){
       var fotoRuta = './web/Productos/images/' + producto.foto;
       await fs.unlink(fotoRuta);  
       var producto= new Producto(datos.id,datos)
       if(producto.bandera==0){
           try{
               await conexion.doc(producto.id).set(producto.obtenerProducto);
               console.log("Producto registrado Correctamente");
               error=0;
           }catch(err){
               console.log("Error al modificar producto"+err);
           }
       }else{
           console.log("Los datos no son correctos");
       }
    }
   return error;
}

async function borrarProducto(id){
    var error = 1;
    var producto = await buscarID(id);
    if (producto != undefined) {
        try{
            var fotoRuta = './web/Productos/images/' + producto.foto;
            await fs.unlink(fotoRuta);
            await conexion.doc(id).delete();
            console.log("Registro borrado");
            error = 0;
        }
        catch(err){
            console.log("Error al borrar producto: "+err);
        }
        return error;     
    }
}


module.exports={
mostrarProductos,
buscarID,
nuevoProducto,
modificarProducto,
borrarProducto
};