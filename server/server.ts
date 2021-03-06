///<reference path="../typings/express/express.d.ts"/>
///<reference path="../typings/body-parser/body-parser.d.ts"/>

import express = require('express');
import bodyParser = require('body-parser');
import api = require('./api');

export var app = express();

app.use(bodyParser.json({extended: true}));

app.use('/api/mnemonics', api.router);

app.use(express.static('./public'));

app.set('port', process.env.port || 8080);