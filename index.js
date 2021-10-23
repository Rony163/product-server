const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

// middlewire
app.use(cors());
app.use(express.json());

// user: practiceUser
// pass: LVol9lY429WpSX2a

const uri = "mongodb+srv://practiceUser:LVol9lY429WpSX2a@cluster0.swfb5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("allProducts");
        const usersCollection = database.collection("products");

        // post api
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await usersCollection.insertOne(newProduct);
            // console.log(result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my CRUD server');
})

app.listen(port, () => {
    console.log('Running server on port :', port);
})