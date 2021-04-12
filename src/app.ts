import express from 'express';
import MongoClient from 'mongodb';
import * as expenses from './api/expenses';
import * as payments from './api/payments';
import * as userGroups from './api/user-groups';
import * as auth from './auth/login';
import * as socialUsers from './api/social-users';
import bodyParser from 'body-parser';
import { authenticateJWT } from './auth/authenticate';
import { DB_USER_NAME, DB_PASSWORD, DB_NAME, PORT } from './utils/constants';

const app = express();
const port = process.env.PORT || PORT;
let database: any;

const username = process.env.DB_USER_NAME || DB_USER_NAME;
const password = process.env.DB_PASSWORD || DB_PASSWORD;
const dbName = process.env.DB_NAME || DB_NAME;


const CONNECTION_URL = `mongodb+srv://${username}:${password}@cluster0.2pegb.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(bodyParser.json(), (_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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

//Authentication    
app.post('/login', (req, res) => auth.login(database, req, res));
app.post('/loginsu', (req, res) => auth.loginSocialUser(database, req, res));

//Social User
app.get("/socialusers/:id", (req, res) => socialUsers.findById(database, req, res));
app.post("/socialusers", (req, res) => socialUsers.create(database, req, res));

//Expenses
app.get("/listUserExpenses/:userEmail", authenticateJWT, (req, res) => expenses.listUserExpenses(database, req, res));
app.post("/createExpense", authenticateJWT, (req, res) => expenses.create(database, req, res));
app.put("/updateExpenses", authenticateJWT, (req, res) => expenses.update(database, req, res));
app.delete("/deleteExpense/:expenseId", authenticateJWT, (req, res) => expenses.remove(database, req, res));
app.post("/searchExpenses", authenticateJWT, (req, res) => expenses.search(database, req, res));
app.post("/searchExpensesSize", authenticateJWT, (req, res) => expenses.countSearch(database, req, res));


//Payments
app.get("/listUserPayments/:userEmail", authenticateJWT, (req, res) => payments.listUserPayments(database, req, res));
app.post("/createPayment", authenticateJWT, (req, res) => payments.create(database, req, res));
app.put("/updatePayments", authenticateJWT, (req, res) => payments.update(database, req, res));
app.delete("/deletePayment/:paymentId", authenticateJWT, (req, res) => payments.remove(database, req, res));
app.post("/searchPayments", authenticateJWT, (req, res) => payments.search(database, req, res));
app.post("/searchPaymentsSize", authenticateJWT, (req, res) => payments.countSearch(database, req, res));


//User Groups
app.get("/listUserGroupOfUser/:userEmail", authenticateJWT, (req, res) => userGroups.listUserGroupOfUser(database, req, res));
