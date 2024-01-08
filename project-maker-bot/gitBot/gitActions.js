require("dotenv").config()
const { request } = require("@octokit/request");
const { createAppAuth } = require("@octokit/auth-app");
const { readFile,listDirectory } = require("./fileActions");

const auth = createAppAuth({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  installationId: process.env.INSTALLATION_ID,
});

const requestWithAuth = request.defaults({
  request: {
    hook: auth.hook,
  },
  mediaType: {
    previews: ["machine-man"],
  },
});

//const tree = ["path":"f4.txt","mode":"100644","type":"blob","content":"f4 dummy text"},
              //{"path":"f5.txt","mode":"100644","type":"blob","content":"f5 dummy text"},
              //{"path":"subdir/f3.txt","mode":"100644","type":"blob","content":"subdir dummy text 3"};

exports.buildLocalTree = function(localDirPath,repoDirPath){
    return new Promise((resolve,reject) => {
        let promises = [];
        listDirectory(localDirPath)
        .then(files => {
            files.forEach(filePath=> {
                promises.push(readFile(`./${filePath}`));
            });
            Promise.all(promises)
            .then(results => {
                resolve(results.map((result,index,contents) => {
                    const file = result.filePath.replace(localDirPath,'');
                    const content = result.content;
                    return {"path": `${repoDirPath}${file}`,"mode":"100644","type":"blob","content": content};
                }));
            })
            .catch(err => {
                reject(err);
            });
        });
    });
}

exports.getRepo = function(repo){
    return requestWithAuth(`GET ${repo}`);
}

exports.getContent = function(repo,path){
    return requestWithAuth(`GET ${repo}/contents${path}`);
}

exports.getLatestCommit = function(repo,branch){
    return requestWithAuth(`GET ${repo}/git/ref/heads/${branch}`);
}

exports.getTree = function(repo,commitSHA){
    return requestWithAuth(`GET ${repo}/git/commits/${commitSHA}`);
}

exports.makeTree = function(repo,baseTreeSHA,newTree){
    return requestWithAuth(`POST ${repo}/git/trees`,
    {
        base_tree : baseTreeSHA,
        tree : newTree
    });
}

exports.makeCommit = function(repo,message,treeSHA,parentCommits){
    return requestWithAuth(`POST ${repo}/git/commits`,
    {
        message : message,
        tree : treeSHA,
        parents : parentCommits
    });
}

exports.makeBranch = function(repo,branchName,commitSHA){
    return requestWithAuth(`POST ${repo}/git/refs`,
    {
        ref : `refs/heads/${branchName}`,
        sha : commitSHA
    });
}

exports.makePR = function(repo,title,branch,baseBranch){
    return requestWithAuth(`POST ${repo}/pulls`,
    {
        title : title,
        head : branch,
        base : baseBranch
    });
}

