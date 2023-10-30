const {writeYAML} = require("./fileActions.js");
const gitActions = require("./gitActions.js");
const utility = require('./utility.js');

const repoOwner = process.env.REPO_OWNER;
const repoName = process.env.REPO_NAME;
const repo = `/repos/${repoOwner}/${repoName}`;
const commitMessage = "Yaml file added";
const templatePath = '/templates/default-project/';

//STEPS

//1. RECEIVE PAYLOAD CONTAINING PROJECT NAME AND USER INFO AND ETC.
const payload = { 'project-dept': 'ph', 
                  'project-env': 'env', 
                  'project-vanity-name': 'dummy', 
                  'project-classification': 'dummy', 
                   members: [ 'momo', 'kitcat', 'oreo' ] , 
                   newProject: true, 
                   ulid : '123456'}

exports.makeProject = function(payload,branchName){
    return new Promise((resolve,reject) => {
        //2. FETCH THE LATEST TEMPLATE DIRECTORY CONTENTS FROM ACM-CORE
        utility.fetchandWriteTemplate(repo,templatePath)
        .then(res => {
            console.log(res);
            
            const targetDirectory = `./target_${branchName}`;
            const makeTargetDirectory = `mkdir ${targetDirectory}`;

            //2.1 MAKE A NEW TARGET DIRECTORY
            utility.execCommand(makeTargetDirectory)
            .then(res => {
                //3. COPY OVER CONTENTS TO A TARGET DIRECTORY and 
                //4. GENERTE ULID
                const commands = [utility.execCommand(`cp -r ./${templatePath} ${targetDirectory}`),
                                  //utility.execCommand(`echo 1234567\\n`)];
                                  utility.execCommand(`./ulid`)];
                Promise.all(commands)
                .then(values => {
                    const ulidStdout = values[1].stdout;
                    const ulid = ulidStdout.substring(0,ulidStdout.length - 1).toLowerCase();
                    console.log(ulid);
                    payload.ulid = ulid;
                    
                    //5. READ IN SETTERS.YAML FILE FORM TARGET DIRECTORY AND 
                    //   POPULATE WITH ULID AND VALUES FROM PAYLOAD
                    const settersFilePath = `${targetDirectory}/default-project/setters.yaml`;
                    const setters = utility.updateSettersFile(settersFilePath,payload);

                    //6. WRITE BACK SETTERS.YAML
                    writeYAML(settersFilePath,setters);

                    //7. FIRE KPT COMMAND TO POPULATE YAML FILES
                    const kptCommand = `cd ${targetDirectory}/default-project && sudo kpt fn render`;
                    utility.execCommand(kptCommand)
                    .then(res => {

                        //8. BUILD A TREE BY READING IN THE NEW CONTENTS OF EACH YAML FILE
                        let tree = [];
                        gitActions.buildLocalTree(`${targetDirectory}/default-project`,'target/default-project')
                        .then(res => {
                            tree = res;
                            console.log(tree);

                            //9. EXECUTE THE GIT WORKFLOW (TREE -> COMMIT -> BRANCH -> PR)
                            utility.commitFilesAndRaisePR(repo,tree,commitMessage,branchName)
                            .then(res => {
                                resolve(res);
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
    });
}
