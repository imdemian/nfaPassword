var express=require("express");
var path=require("path");
var cors=require("cors");
var session=require("cookie-session");
var usuariosRutas=require("./rutas/usuariosRutas");
var productosRutas=require("./rutas/productosRutas");
var rutasUsuariosApis=require("./rutas/usuariosRutasApi");
var rutasProductosApis=require("./rutas/productosRutasApi");

var app=express();
app.set("view engine","ejs");
app.use(cors());
app.use(session({
    name:"session",
    keys:["hsuwj213js"],
    maxAge:24*60*60*1000
}));
//app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/",express.static(path.join(__dirname,"/web")));
app.use("/",usuariosRutas);
app.use("/productos",productosRutas);
app.use("/",rutasUsuariosApis);
app.use("/",rutasProductosApis);



var port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});