const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3030;
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// app.use( bodyParser.json() );
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(cors());


app.post('/upload/' , upload.single("workers"), (req, res) => {   
    if (!req.body) return res.sendStatus(400);
    // console.log(req);
      const result = req.body;
        if(result){
            console.log(result);
        }else{
            console.log("goombatron");
        }
    res.json("dddd");
})

// app.get('/user/' ,(req, res) => {   
//     if (!req.body) return res.sendStatus(400);
    
//     res.json({"user":{"id":2234,"name":"Admin BTC","bot_user_list":["testEX","testBF"]}});
// })

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})