import { ObjectID } from "mongodb";

const COLLECTION_NAME = "payments";

const listUserPayments = (database, req, res) => {
    const user = req.params.userEmail;
    database.collection(COLLECTION_NAME).find({$or: [{paidUser:user}, {chargedUser: user}]}).toArray(
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
        let query = {_id: new ObjectID(req.body[i]._id)};
        delete req.body[i]._id;
        req.body[i].date = new Date(req.body[i].date);
        let newValues = {$set: req.body[i]};
        database.collection(COLLECTION_NAME).updateOne(query, newValues, (err, result) => {
            if (err) {
                errorMessage = `Error updating payments: ${err}`;
            }
        });
    }

    if (errorMessage) {
        res.json({error: errorMessage});
    } else {
        res.json({message:'Payments updated.'});
    }
}



export {listUserPayments, create, update}