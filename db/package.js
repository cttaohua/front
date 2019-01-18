var query = require('../config/node-mysql.js');

var find = function(table, where, callback) { //查找一条;
	var obj = objdefine(where);
	var sql = "SELECT * FROM " + table + ' ' + obj._where + ' LIMIT 1';
	query(sql, obj._arr, function(err, vals, fields) {
		if (err) {
			callback(err, 0);
		} else {
			callback(null,vals[0]);
		}
	});
}
var select = function(table, where, condition, callback) { //查找所有;
  var obj = objdefine(where);
  if(typeof condition=='function') {
    var sql = "SELECT * FROM " + table + ' ' + obj._where;
	query(sql, obj._arr, condition);
  }else {
  	var sql = "SELECT * FROM " + table + ' ' + obj._where + ' ' + condition;
	query(sql, obj._arr, callback);
  }
	
}
var insert = function(table, obj, callback) {
	var fields = 'set ';
	var values = [];
	for (var k in obj) {
		fields += k + '=?,';
		values.push(obj[k]);
	}
	fields = fields.slice(0,fields.length-1); 
   var sql = "INSERT INTO " + table + ' ' + fields;
   query(sql, values, callback);
	
}
/**
  sets is object；
  where is object;
*/
var update = function(table, sets, where, callback) {
	var obj = objdefine(where);
	var _SETS = '';
	var values = [];
	for (var k in sets) {
		_SETS += k + '=?,';
		values.push(sets[k]);
	}
	_SETS = _SETS.slice(0, _SETS.length-1);
	values = values.concat(obj._arr);
	var sql = "UPDATE " + table + ' SET ' + _SETS + ' ' + obj._where;
	query(sql, values, callback);
}
var del = function(table, where, callback) {
	var obj = objdefine(where);
	var sql = "DELETE FROM " + table + ' ' + obj._where;
	query(sql, obj._arr, callback);
}

function objdefine(where) {
	var _where = '';
	var _arr = [];
	if(typeof where == 'object') {
		_where = 'WHERE ';
		for(var k in where) {
			_where += k + '=?' + ' AND ';
			_arr.push(where[k]);
		}
		_where = _where.slice(0,_where.length-4);
	}else {
		_where = where;
	}
	return {
		_where: _where,
		_arr: _arr
	}
}

module.exports = {
	insert: insert,
	select: select,
	find: find,
	del: del,
	update: update
};
