What is this?
=============

The Chat-u-lator is a web-based multi-user calculator. The results of the last 10 calculations
are shown in reverse chronological order. The results are shown to all users and
displayed in realtime. The Chat-u-lator utilizes the [math.js](http://mathjs.org/) library to perform calculations.

What is it for?
===============

This is a simple demo that shows how to use Web sockets in a Node application.
Please feel free to use as a foundation for your own projects.


Installation
============

1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) if you have not done so already.
2. Create an SQL database. [ElephantSQL](https://www.elephantsql.com/) makes this super easy.
3. Download this repository.
4. Open a terminal window, and change to the root directory of the project.
5. Enter `npm install` at the command line.
6. Set the environment variable `ConnectionString` to point to your SQL database.
7. Enter `node models/create-database-table.js` at the command line. 
8. Enter `npm start` at the command line. 

Here is an example of a connection string for a Postgres database.

	$ export ConnectionString="postgres://username:password@db.example.com:5432/database"


Deployment
==========

I deployed this application on Amazon Elastic Beanstalk at http://tiny.cc/chatulator.
I recommend using the [command line interface](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html).
I will not include detailed instructions, but if I can figure it out, then you can too. I believe in you!!!
