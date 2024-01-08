const subProcess = require('child_process');

exports.execCommand = function(command){
    return new Promise((resolve,reject)=>{
        subProcess.exec(command , (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                            stdout:stdout.toString(),
                            stderr: stderr.toString()
                        });
            }
        });
    });
}
