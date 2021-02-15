import express from 'express';
import MongoClient from 'mongodb';
import * as expenses from './api/expenses';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
let database: any; 

const username = 'USER_NAME';
const password = 'PASSWORD';
const dbName = 'DB_NAME';

const DATABASE_NAME = "splitter";
const CONNECTION_URL = `mongodb+srv://${username}:${password}@cluster0.2pegb.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(bodyParser.json());

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        database = client.db(DATABASE_NAME);
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        });
    }).catch(err => {
        console.log(`db error ${err.message}`);
        process.exit(-1)
    })


app.get("/listExpenses", (_, res) => expenses.list(database, res));
app.post("/createExpense", (req, res) => expenses.create(database, req, res));
