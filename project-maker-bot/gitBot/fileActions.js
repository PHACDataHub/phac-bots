const fs = require('fs');
const yaml = require('js-yaml');
const { glob } = require('glob');

exports.listDirectory = function(path){
    return new Promise((resolve,reject)=>{
        glob(`${path}/**`,{ nodir : true })
        .then(files => { resolve(files); })
        .catch(err => { reject(err); });
    })
}

exports.readFile = function(filePath){
    return new Promise((resolve,reject) => {
        fs.readFile(filePath,"utf8", (err,data) => {
            if(err){
                reject(err);
            }
            else{
                resolve({filePath : filePath, content : data});
            }
        });
    });
}

exports.writeFile = function(filePath,content,async = true){
    if(async){
        return new Promise((resolve,reject) => {
            fs.writeFile(filePath,content,(err) => {
                if(err){
                    reject(err);
                }
                resolve(`${filePath} created`);
            });
        });
    }
    else{
        fs.writeFileSync(filePath,content);
    }
}

exports.readYAML = function(file){
    return yaml.load(fs.readFileSync(file, 'utf8'));
}

exports.writeYAML = function(file,payload){
    fs.writeFile(file, yaml.dump(payload), (err) => {
        if (err) {
            console.log(err);
        }
    });
}
