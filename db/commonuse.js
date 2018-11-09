const db = require('./package.js');
const query = require('../config/node-mysql.js');

module.exports = {
    roleList: function(callback) { //查询所有的角色
        db.select('th_role', '', function(err, vals) {
            if (err) {
                callback('err', err);
            } else {
                callback(null, vals);
            }
        })
    },
    classify_first_list: function(callback) { //查询一级分类
        db.select('th_classify_first', '', function(err, vals) {
            if (err) {
                callback('err', err);
            } else {
                callback(null, vals);
            }
        })
    }
}