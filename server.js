let express = require('express'),
    app = express(),
    http = require('http'),
    server = http.Server(app),
    io = require('socket.io')(server),
    sanitizeHtml = require('sanitize-html'),
    bodyParser = require('body-parser'),
    math = require('mathjs'),
    pg = require('pg'),
    connectionString = process.env.ConnectionString,
    PORT = process.env.PORT || 3000;

function save(equation) {
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            done();
            console.log(err);
        }

        let query = client.query('INSERT INTO calc(text) values($1)', [equation]);

        query.on('end', function () {
            done();
        });
    });
}

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (request, response) {
    response.sendFile('index.html');
});

io.on('connection', function (socket) {
    socket.on('message', function (m) {
        let clean = sanitizeHtml(m, {
            allowedTags: [],
            allowedAttributes: []
        });

        if (m !== clean) {
            return socket.emit('err', 'HTML not allowed');
        }

        try {
            let value = math.eval(m),
                equation = m + " = " + value;
            io.emit('message', equation);
            save(equation);
        } catch (err) {
            return socket.emit('err', err.message);
        }

    });
});




app.get('/api/v1/calc', function (req, res) {
    let results = [];
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }
        let query = client.query('SELECT * FROM calc ORDER BY id DESC LIMIT 10;');

        query.on('row', function (row) {
            results.push(row);
        });

        query.on('end', function () {
            done();
            return res.json(results);
        });
    });
});

server.listen(PORT, function () {
    console.log('Listening on Port', PORT);
});
