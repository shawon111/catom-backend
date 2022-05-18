const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// test api
app.get('/', (req, res) => {
    res.send("catom backend")
});

//connect with mongo db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.70jr9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// creating api's
async function run() {
    try {
        await client.connect();
        const database = client.db('roob_airdrop');
        const dataCollection = database.collection('catom_data');

        //get api for finding catom info
        app.get('/catomdata', async (req, res)=>{
            const queryData = req.query.address;
            const query = {atom_address : queryData};
            let result = await dataCollection.findOne(query);
            if(result===null){
                const newQuery = {juno_address : queryData};
                const newResult = await dataCollection.findOne(newQuery);
                result = newResult;
            }
            console.log("query data",queryData);
            console.log("result",result);
            res.json(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("listening to the port: ", port)
});