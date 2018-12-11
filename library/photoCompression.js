var images = require("images");
var fs = require("fs");
var path = "public/uploadImg";
function explorer(path){
    fs.readdir(path, function(err, files){
    //err 为错误 , files 文件名列表包含文件夹与文件
        if(err){
            console.log('error:\n' + err);
            return;
        }

        files.forEach(function(file){

            fs.stat(path + '/' + file, function(err, stat){
                if(err){console.log(err); return;}
                if(stat.isDirectory()){                 
                    // 如果是文件夹遍历
                    explorer(path + '/' + file);
                }else{
                    // 读出所有的文件
                    if(file.indexOf('DS_Store')==-1) {
                        var name = path + '/' + file;
                        var outName = path + '/' +file;
                        if(images(name).width()>2000) {
                            images(name)
                            .size(1000)
                            .save(outName, {               
                                    quality : 50              
                            });
                        }else {
                            images(name)
                            .save(outName, {               
                                    quality : 50                   
                            });
                        }
                        
                    }
                }               
            });

        });

    });
}
explorer(path);