/*
mysql 事务js
*/
const mysql = require('mysql');
const async = require('async');
const mysqlConfig = require('../bin/config.js').mysqlConfig;

const pool = mysql.createPool(mysqlConfig);

function execTrans(sqlparamsEntities, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            return callback(err, null);
        }
        connection.beginTransaction((err) => {
            if (err) {
                return callback(err, null);
            }
            let funcAry = [];
            //开始执行
            sqlparamsEntities.forEach((sql_param) => {
                let temp = function(cb) {
                    let sql = sql_param.sql;
                    let params = sql_param.params;
                    connection.query(sql, params, (err, rows, fields) => {
                        if (err) {
                            connection.rollback(() => {
                                console.log('事务失败');
                                throw err;
                            })
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                }
            })
            funcAry.push(temp);
        });

        async.series(funcAry, (err, result) => {
            if (err) {
                connection.rollback((err) => {
                    connection.release();
                    return callback(err, null);
                })
            } else {
                connection.commit((err, info) => {
                    if (err) {
                        connection.rollback((err) => {
                            connection.release();
                            return callback(err, null);
                        })
                    }else {
                    	connection.release();
                    	return callback(null, info);
                    }
                })
            }
        })

    })
}

module.exports = execTrans;
