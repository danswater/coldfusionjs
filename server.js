'use strict';
var http    = require( 'http' );
var express = require( 'express' );
var path    = require( 'path' );
var fetch   = require( 'request' );
var util    = require( 'util' );
var app     = express();
var server  = http.createServer( app );

var config;

var files    = path.join( process.cwd() );
var root     = ( config && config.url ) || 'http://10.1.2.20:8500'; // 10.1.2.51

util.log( 'root URL for proxy server is: ' + root );

var proxyShinji = function ( request, response, next ) {
	//var url = root + '/shinji' + request.path;
	var url = root + request.path;
	if ( process.env.TRAVIS !== 'true' ) {
		util.log( 'proxing request for ' + request.method + ' ' + url );
	}

	request.pipe( fetch( {
		'method' : request.method,
		'url'    : url,
		'qs'     : request.query,
		'json'   : true
	}, function ( error, res, body ) {
		if ( error ) {
			util.log( 'Catched unhandled stream error in pipe ' + error );
		}
	} ) ).pipe( response );
};

app.use( '/shinji', proxyShinji );

// this project's files
app.use( express.static( files ) );


server.listen( '8080' );