const request = require('request');
const fs = require('fs');

class Ut {
    /**
	 * 下载网络图片
	 * @param {object} opts 
	 */
    static downImg (opts,path) {
        return new Promise((resolve,reject)=>{
            request
            .get(opts)
            .on('response',()=>{})
            .pipe(fs.createWriteStream(path))
            .on('error',(e)=>{
                reject('保存失败');
            })
            .on('finish',()=>{
                resolve('保存成功');
            })
        })
    }
}

module.exports = Ut;