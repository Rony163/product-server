const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

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

        // get api
        app.get('/products', async (req, res) => {
            const cursor = usersCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await usersCollection.findOne(query);
            res.send(product);
        })

        // post api
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await usersCollection.insertOne(newProduct);
            // console.log(result);
            res.json(result);
        });

        // update api
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateProduct.name,
                    price: updateProduct.price,
                    quantity: updateProduct.quantity
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            // console.log(result);
            res.json(result);
        })

        // delete api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
            // console.log("deleted id is", id);
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