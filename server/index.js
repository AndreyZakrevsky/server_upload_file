const express     = require('express');
const app         = express();
const formidable  = require('formidable')
const csv         = require('csv-parser'); 
const cors        = require('cors');
const fs          = require('fs');
const MongoClient = require('mongodb').MongoClient;
const uri         = "mongodb+srv://andrey:andrey@cluster0-ygwbo.mongodb.net/workers_db?retryWrites=true";
const client      = new MongoClient(uri, { useNewUrlParser: true });
app.use(cors());

let results = [];
let responce = null;

app.post('/upload',  async(req, res ) => {
    responce = res;
    readFile(req);   
});

app.get('/all-workers',  async(req, res ) => {
    responce = res;
    client.connect(async (err) => {
            
        if (err) return
       
        const collection = await client.db("workers_db").collection("workers");
           
        try{

          let getItems = await collection.find({}).toArray();
          responce.json(getItems);

        }catch(e){

          responce.json("Some error");
        }    
        // client.close();
      });
});

app.post('/clear',  async(req, res ) => {
    responce = res;
    client.connect(async (err) => {
            
        if (err) return
       
        const collection = await client.db("workers_db").collection("workers");

        try{

            let deleted = await collection.deleteMany();
            responce.json({deleted : true});

        }catch(e){
            responce.json("Some error");
        }
        
        // client.close();
      });
});

app.listen(3030, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on 3030`)
})


const readFile  = (req) => {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/upload/' + file.name;
    });

    form.on('file', function (name, file ){
        processData(file);    
    });  
}


const processData = (file , res) => {  

    fs.createReadStream(file.path)  

    .pipe(csv())

    .on('data', (data) => {
     let res = Object.assign({}, data);
        results.push(res)
    })

    .on('end', () => {     
        let arrayToDb = [...results];
        let agreement = true;
           
        arrayToDb.map( (item)=>{
          for(let i in item){
             if(item[i].length == 0 ){
                agreement = false;
             }
          }
        });
        
        if(agreement){ 
          client.connect(async (err) => {      
            if (err) return;        
            const collection = await client.db("workers_db").collection("workers");          
            try{
             
              let res = await  collection.insertMany(arrayToDb); 
              let getItems = await collection.find({}).toArray();
              responce.json(getItems);
  
            }catch(e){ 
              responce.json("Some error");
            }               
            //client.close();
            fs.unlinkSync(file.path);
            results = [];
          });
        }else{
          responce.json(null);
          fs.unlinkSync(file.path);
          results = [];
          return;
        }
        
    });
 };


 
