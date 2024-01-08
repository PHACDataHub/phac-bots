const fs = require('fs');
const {readYAML,writeFile} = require("./fileActions.js");
const gitActions = require("./gitActions.js");
const { env } = require('process');
const subProcess = require('child_process');

exports.execCommand = function(command){
    return new Promise((resolve,reject)=>{
        subProcess.exec(command , (err, stdout, stderr) => {
            if (err) {
                console.log("error executing command")
                reject(err);
            } else {
                resolve({stdout:stdout.toString(),
                        stderr: stderr.toString()});
            }
        });
    });
}

exports.fetchandWriteTemplate = function(repo,path){
    return new Promise((resolve,reject) => {
        let filePromises = []
        gitActions.getContent(repo,path)
        .then(res => {
            const data = res.data;
            filePromises = data.map(file => gitActions.getContent(repo,path+file.name));
            Promise.all(filePromises)
            .then(values => {
                values.forEach((value, index, values) => {
                    const fileName = value.data.name;
                    const base64content = value.data.content;
                    const bufferObj = Buffer.from(base64content,'base64');
                    const content = bufferObj.toString('utf8');
                    try {
                        console.log(`Writing file ${fileName}`);
                        writeFile(`./${path}${fileName}`, content, false);
                    } catch (err) {
                        reject(err);
                    }
                });
                resolve("New files fetched and written");
            })
            .catch(err => {
                reject(err);
            });
        });
    });
}

exports.updateSettersFile = function(pathToSettersFile,payload){
    const props = ['project-dept','project-env','project-vanity-name','project-classification'];
    const members = payload['members'];
    const newProject = payload['newProject'];
    const setters = readYAML(pathToSettersFile);
    props.forEach(prop => {
        setters.data[prop] = payload[prop];
    });
    setters.data['project-unique-id'] = payload.ulid;
    if(newProject){
        setters.data['iam-owners'] = '';
    }
    members.forEach(member => {
        const memberString = `- member: "user:${member}"\n`
        setters.data['iam-owners'] += memberString;
    });
    return setters;
}

exports.commitFilesAndRaisePR = function(repo,tree,commitMessage,branch){
    return new Promise((resolve,reject) => {
        gitActions.getRepo(repo)
        .then(result => {
            const baseBranch = result.data.default_branch;

            //Get Latest Commit SHA
            gitActions.getLatestCommit(repo,baseBranch)
            .then(result => {
                const latestCommitSHA = result.data.object.sha;

                //Get the Tree for that latest commit 
                gitActions.getTree(repo,latestCommitSHA)
                .then(result => {
                    const treeSHA = result.data.tree.sha;

                    //Make a new Tree with the new files and subdirs
                    gitActions.makeTree(repo,treeSHA,tree)
                    .then(result => {
                        const newTreeSHA = result.data.sha;

                        //Commit the new tree
                        gitActions.makeCommit(repo, commitMessage, newTreeSHA, [latestCommitSHA])
                        .then(result => {
                            const newCommitSHA = result.data.sha;

                            //Make a new branch with the new commit sha
                            gitActions.makeBranch(repo, branch, newCommitSHA)
                            .then(result => {
                                console.log(result.data);

                                //Make a PR for that branch
                                gitActions.makePR(repo, `Merging ${branch} into ${baseBranch}`, 
                                    branch, baseBranch)
                                .then(result => {
                                    console.log(result.data);
                                    const pr_number = result.data.number;
                                    const pr_id = result.data.id;
                                    resolve(result);
                                })
                                .catch(err => {
                                    reject(err);
                                })
                            })
                            .catch(err => {
                                reject(err);
                            });
                        })
                        .catch(err => {
                            reject(err);
                        });
                    })
                    .catch(err => {
                        reject(err);
                    });
                })
                .catch(err => {
                    reject(err);
                });
            })
            .catch(err => {
                reject(err);
            });
        })
        .catch(err => {
            reject(err);
        });
    });
}
