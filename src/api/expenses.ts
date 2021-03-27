import { ObjectID } from "mongodb";

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

const update = (database, req, res) => { 
    let errorMessage = '';
    for (var i = 0; i < req.body.length; i++) {
        let query = {_id: new ObjectID(req.body[i]._id)};
        delete req.body[i]._id;
        let newValues = {$set: req.body[i]};
        database.collection(COLLECTION_NAME).updateOne(query, newValues, (err, result) => {
            if (err) {
                errorMessage = `Error updating expenses: ${err}`;
            }
        });
    }

    if (errorMessage) {
        res.json({error: errorMessage});
    } else {
        res.json({message:'Expenses updated.'});
    }
}

const remove = (database, req, res) => {
    const id = req.params.expenseId;
    let query = {_id: new ObjectID(id)};
    database.collection(COLLECTION_NAME).deleteOne(query, (err, result) => {
        res.json({message:'Expense removed.'});
    })
}

export {listUserExpenses, listGroupExpenses, create, update, remove}