
const COLLECTION_NAME = "expenses";

const listUserExpenses = (database, req, res) => {
    const user = req.params.userEmail;
    database.collection(COLLECTION_NAME).find({$or: [{receiverUser:user}, {chargedUser: user}]}).toArray(
        (err, docs) => {   
            res.json(docs);
        }
    );
}

const listGroupExpenses = (database, req, res) => {
    const group = req.params.groupId;
    database.collection(COLLECTION_NAME).find({group}).toArray(
        (err, docs) => {   
            res.json(docs);
        }
    );
}

const create = (database, req, res) => {
    database.collection(COLLECTION_NAME).insertOne(req.body, (err, result) => {
        res.send(result.insertedId);
    });
}

export {listUserExpenses, listGroupExpenses, create}