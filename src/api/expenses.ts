
const COLLECTION_NAME = "expenses";

let list = (database, res) => {
    database.collection(COLLECTION_NAME).find({}).toArray(
        (err, docs) => {   
            res.json(docs);
        }
    );
}

let create = (database, req, res) => {
    database.collection(COLLECTION_NAME).insertOne(req.body, (error, result) => {
        res.send(result.insertedId);
    });
}

export {list, create}