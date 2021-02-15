import express from 'express';
import MongoClient from 'mongodb';
import * as expenses from './api/expenses';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;
let database: any; 

const username = process.env.DB_USER_NAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const CONNECTION_URL = `mongodb+srv://${username}:${password}@cluster0.2pegb.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(bodyParser.json(),(_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        database = client.db(dbName);
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        });
    }).catch(err => {
        console.log(`db error ${err.message}`);
        process.exit(-1)
    })


app.get("/listExpenses", (_, res) => expenses.list(database, res));
app.post("/createExpense", (req, res) => expenses.create(database, req, res));
