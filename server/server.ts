///<reference path="../typings/express/express.d.ts"/>
///<reference path="../typings/body-parser/body-parser.d.ts"/>

import express = require('express');
import bodyParser = require('body-parser');

export var app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('./public'));

app.set('port', process.env.port || 8080);