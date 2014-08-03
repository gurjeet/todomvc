/*global angular */

/* Global: Postrges driver */
var pg = require('pg.js');

pg.defaults.poolSize = 1;

/**
 * Services that persists and retrieves TODOs from localStorage
 */
angular.module('todomvc')
	.factory('todoPostgresStorage', function () {
		'use strict';

		var connection_str = 'postgres://todo_user:todo_password@localhost/postgres';

		var upsert_cmd = 'select upsert_todo_list($1)';
		var select_cmd = 'select items from todo';

		return {
			get: function (callback) {
				pg.connect(connection_str, function(err, client, done) {

					if (err) {
						callback('error: Could not fetch client from pool: ' + JSON.stringify(err));
						return;
					}

					client.query( {name: 'read_list', text: select_cmd}, function(err, result) {
						if (err) {
							done();	//Return client back to the pool
							callback('error: Could not fetch data from database: ' + JSON.stringify(err));
							return;
						}

						done();	//Return client back to the pool

						callback(null, result.rows[0].items);
						return;
					});

				});
			},

			put: function (todos, callback) {
				pg.connect(connection_str, function(err, client, done) {

					if (err) {
						callback('error: Could not fetch client from pool: ' + JSON.stringify(err));
						return;
					}

					client.query( {name: 'read_list', text: upsert_cmd, values: [JSON.stringify(todos)]}, function(err, result) {
						if (err) {
							done();	//Return client back to the pool
							callback('error: Could not save data to database: ' + JSON.stringify(err));
							return;
						}

						done();	//Return client back to the pool

						callback(null, '');
						return;
					});

				});
			}
		};
	});
