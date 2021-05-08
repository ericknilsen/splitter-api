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

const getQuery2 = (req) => {
    const { userEmail, startDate, endDate, status } = req.body;
    
    const query: any = {
        $and: [
            {"date":{ $gte: new Date(startDate), $lt: new Date(endDate) }},
            {
                $or: [{ receiverUser: userEmail }, { chargedUser: userEmail }]
            }
        ]
    }

    if(status) {
        query['$and'].push({ status });
    }

    return query;
}

const getQuery = (req) => {
    const { userEmail, month, status } = req.body;
    const currentYear = new Date().getFullYear();

    const query: any = {
        $and: [
            { $expr: { $eq: [{ $month: '$date' }, parseInt(month)] } },
            { $expr: { $eq: [{ $year: '$date' }, currentYear] } },
            {
                $or: [{ receiverUser: userEmail },
                { chargedUser: userEmail }]
            }
        ]
    }

    if(status) {
        query['$and'].push({ status });
    }

    return query;
}

const search = (database, req, res) => {
    let { page, limit } = req.body;

    let skip = 0;
    if (!page || !limit) {
        limit = Number.MAX_SAFE_INTEGER;
    } else {
        skip = (page - 1) * limit;
    }

    let query: string;
    if (req.body.month) {
        query = getQuery(req);
    } else {
        query = getQuery2(req);
    }
    
    database.collection(COLLECTION_NAME).find(query)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1, description: 1, _id: 1 })
        .toArray(
            (err, docs) => {
                res.json(docs);
            }
        );
}


const countSearch = (database, req, res) => {
    const query = getQuery(req);
    database.collection(COLLECTION_NAME).find(query)
        .count(
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

export { listUserExpenses, create, update, remove, search, countSearch }