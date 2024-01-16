const express = require("express");
const app = express();
const port = 3000//process.env.PORT;

app.use(express.json());

const func = (delay,res) => {
    setTimeout(function(){
        res.send("hello");
    },delay);
}

app.get("/", function(req,res) {
    res.send("hello");
});

app.post('/', function (req, res) {
    console.log(req.body);
    //console.log(`Delay : ${req.body.delay}`)
    //const delay = Number(req.body.delay);
    //func(delay,res);
    res.send("done");
})

app.listen(port, function () {
  console.log(`RabbitMQProxy on port ${port}!`);
});