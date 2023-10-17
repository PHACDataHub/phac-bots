const express = require("express");
const automator = require("./automator");
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', function (req, res) {
    res.send("hello");
})

app.post('/', function (req, res) {
    try{
        const payload = req.body;
        console.log(payload);
        automator.makeProject(payload, new Date().getTime().toString())
                .then(data => {res.send(data)})
                .catch(err => {console.log(err);
                                return res.status(400).send({
                                message: err
                            });
                        });
    }
    catch(err){
        return res.status(400).send({
            message: err
        });
    }
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});