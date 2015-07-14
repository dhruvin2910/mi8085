///<reference path="typings/node/node.d.ts"/>

import Server = require('./server/server');

Server.app.listen(Server.app.get('port'));