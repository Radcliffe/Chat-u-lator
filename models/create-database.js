var pg = require('pg');
var connectionString = process.env.ConnectionString;

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('DROP TABLE IF EXISTS calc');
query.on('end', function() { client.end(); });

query = client.query('CREATE TABLE calc(id SERIAL PRIMARY KEY, text VARCHAR(255))');
query.on('end', function() { client.end(); });