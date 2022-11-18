const mongoose = require('mongoose');
require('../model/user');
require('../model/template');
require('../model/evaluation');

mongoose.connect(process.env.DB_URL);

mongoose.connection.on(process.env.connected, function(){
    console.log(process.env.DB_CONNECTED_MSG);
});
mongoose.connection.on(process.env.disconnected, function(){
    console.log(process.env.DB_DISCONNECTED_MSG);
});
mongoose.connection.on(process.env.err, function(err){
    console.log(process.env.DB_CONNECTION_ERROR_MSG,process.env.err);
});

process.on(process.env.SIGINT, function(){
    mongoose.connection.close(function(){
        console.log(process.env.DB_CLOSED_MSG);
        process.exit(0);
    });
});

process.on(process.env.SIGTERM, function(){
    mongoose.connection.close(function(){
        console.log(process.env.DB_SIGTERM_MSG);
        process.exit(0);
    });
})
process.once(process.env.SIGUSR2, function(){
    mongoose.connection.close(function(){
        console.log(process.env.DB_SIGUSR_MSG);
        process.kill(process.pid, process.env.SIGUSR2);
    })
});

