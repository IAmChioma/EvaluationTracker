require('dotenv').config();
require('./api/db/db_connection');
const express = require('express');
const path = require('path');
const routes = require('./api/routes');
const app = express();



app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(function(req,res, next){
    console.log(process.env.START_DEBUG_MSG, req.method, req.url);
    next();
});

app.use('/api',function(req,res,next){
    res.header("Access-Control-Allow-Origin","http://localhost:4200");
    res.header("Access-Control-Allow-Methods","DELETE, PUT, PATCH, GET, POST, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    next();
})


app.use(express.static(path.join(__dirname, process.env.PUBLIC_FOLDER)));

app.use("/api", routes);
const server = app.listen(process.env.PORT_NUMBER, function(){
    const port = server.address().port;
    console.log(process.env.START_MSG, port);
});