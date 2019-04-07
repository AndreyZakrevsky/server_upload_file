const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://andrey:andrey@cluster0-ygwbo.mongodb.net/workers_db?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    if (err) {
        console.error(err)
        return
      }
      const collection = client.db("workers_db").collection("workers");
      collection.insert({item: "Mops good guy!"})
      collection.find({}).toArray(function(error, result) {
          if (err) throw err
          console.log(result.map(it => it.item))
      })
    
  client.close();
});