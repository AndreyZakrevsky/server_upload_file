const express     = require('express');
const app = express();
const cors        = require('cors');
const bodyParser  = require('body-parser');
const formidable  = require('formidable')
const csv         = require('csv-parser'); 
const fs          = require('fs');
// const { CSVFileReader} = require("./utils");

app.post('/upload', async(req, res )=>{
    
    let responce = res;
    
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/upload/' + file.name;
    });

    form.on('file', function (name, file ){
        readFile(file, responce);
        
    });

    
});

app.listen(3030, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on 3030`)
})


const readFile = (file , res)=>{  
    let responce = res;

    let results = [];

    fs.createReadStream(file.path)  

    .pipe(csv())

    .on('data', (row) => results.push(row))

    .on('end', (res) => {   
        // responce.json(results);
        
        test(responce , results);

       
        // console.log(file.path)
         fs.unlinkSync(file.path);
         results = [];
    });
 };

 const test = (responce , results)=>{
    responce.json(results);
 }