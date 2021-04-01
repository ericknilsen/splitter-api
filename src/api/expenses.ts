import { ObjectID } from "mongodb";

const COLLECTION_NAME = "expenses";

const listUserExpenses = (database, req, res) => {
    const user = req.params.userEmail;
    database.collection(COLLECTION_NAME).find({ $or: [{ receiverUser: user }, { chargedUser: user }] })
        .sort({ date: -1 })
        .toArray(
            (err, docs) => {
                res.json(docs);
            }
        );
}

const search = (database, req, res) => {
    const { userEmail, month, status } = req.body;

    const query: any = {
        $and: [
            { $expr: { $eq: [{ $month: '$date' }, parseInt(month)] } },
            {
                $or: [{ receiverUser: userEmail },
                { chargedUser: userEmail }]
            }
        ]
    }

    if(status) {
        query['$and'].push({ status });
    }

    database.collection(COLLECTION_NAME).find(query)
        .sort({ date: -1 })
        .toArray(
            (err, docs) => {
                res.json(docs);
            }
        );
}

const create = (database, req, res) => {
    req.body.date = new Date(req.body.date);
    database.collection(COLLECTION_NAME).insertOne(req.body, (err, result) => {
        res.send(result.insertedId);
    });
}

const update = (database, req, res) => {
    let errorMessage = '';
    for (var i = 0; i < req.body.length; i++) {
        let query = { _id: new ObjectID(req.body[i]._id) };
        delete req.body[i]._id;
        req.body[i].date = new Date(req.body[i].date);
        let newValues = { $set: req.body[i] };
        database.collection(COLLECTION_NAME).updateOne(query, newValues, (err, result) => {
            if (err) {
                errorMessage = `Error updating expenses: ${err}`;
            }
        });
    }

    if (errorMessage) {
        res.json({ error: errorMessage });
    } else {
        res.json({ message: 'Expenses updated.' });
    }
}

const remove = (database, req, res) => {
    const id = req.params.expenseId;
    let query = { _id: new ObjectID(id) };
    database.collection(COLLECTION_NAME).deleteOne(query, (err, result) => {
        res.json({ message: 'Expense removed.' });
    })
}

export { listUserExpenses, create, update, remove, search }