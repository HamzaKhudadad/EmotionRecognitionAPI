const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');

const flash = require('connect-flash');

const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');


const container = require('./container');

container.resolve(function(pictureprediction,_,audioprediction,home,audioapi,pictureapi){

    
    const app = SetupExpress();

    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);

        server.listen(process.env.PORT || 3000, function(){
            console.log('Listening on port 3000');
        });
        ConfigureExpress(app);


        //Setup router
        const router = require('express-promise-router')();
        pictureprediction.SetRouting(router);
        audioprediction.SetRouting(router);
        home.SetRouting(router);
        pictureapi.SetRouting(router);
        audioapi.SetRouting(router);

        app.use(cors());


        app.use(router);

        app.use(function(req, res){
            res.render('404');
        });
    }

    function ConfigureExpress(app){
        app.use(compression());
        app.use(helmet());

      


        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));



        app.use(flash());


        app.locals._ = _;

    }

});
