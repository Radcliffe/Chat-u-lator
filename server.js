var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser')
var math = require('mathjs');

var pg = require('pg');
var connectionString = process.env.ConnectionString;

app.use(express.static('public'));

var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(request, response) {
    response.sendFile('index.html');
});

io.on('connection', function(socket) {
    socket.on('message', function (m) {
        var clean = sanitizeHtml(m, {
            allowedTags: [],
            allowedAttributes: []
        });

        if (m != clean) {
            return socket.emit('err', 'HTML not allowed');
        }

        try {
            var value = math.eval(m);
            var equation = m + " = " + value;
            io.emit('message', equation);
            save(equation);
        }
        catch (err) {
            return socket.emit('err', 'Unable to evaluate expression');
        }

    });
});

function save(equation) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done();
            console.log(err);
        }

        var query = client.query('INSERT INTO calc(text) values($1)', [equation]);

        query.on('end', function() {
            done();
        });
    });
}


app.get('/api/v1/calc', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        var query = client.query('SELECT * FROM calc ORDER BY id DESC LIMIT 10;');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });
    });
});

server.listen(PORT, function() {
    console.log('Listening on Port', PORT);
});
