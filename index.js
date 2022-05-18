const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
// middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Running Protected Todo App Server')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrlxa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('todoApp').collection('task');

        // get task 
        app.get('/task', async (req, res) => {
            const email = req.query.email;
            if (email) {
                const cursor = taskCollection.find({ email: email });
                const tasks = await cursor.toArray();
                res.send(tasks)
            }
            else {
                res.status(403).send({ message: 'forbidden access' })
            }

        })

        // add task 
        app.put('/task', async (req, res) => {
            const doc = req.body;
            const result = await taskCollection.insertOne(doc);
            res.send(result);
        })

        // delete task item 
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const result = await taskCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        })

    }
    finally {
        // await client.close()
    }
}
run()


app.listen(port, () => {
    console.log('Listening the port', port);
})