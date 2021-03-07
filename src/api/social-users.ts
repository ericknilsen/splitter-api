
const COLLECTION_NAME = "social-users";

const findSocialUser = (database, req) => {
    const id = req.body.id;
    return new Promise<any>((resolve, reject) => {
        database.collection(COLLECTION_NAME).findOne({id},
            (error, docs) => {   
                if (error) {
                    reject(error.message);
                } else {
                    if (docs) {
                        resolve(docs);
                    } else {
                        reject('User not found');
                    } 
                }
            }
        );
    });
}

const findById = (database, req, res) => {
    const id = req.params.id;
    database.collection(COLLECTION_NAME).findOne({id},
        (error, docs) => {   
            if (error) {
                res.send(error.message);
            } else {
                if (docs) {
                    res.send(docs);
                } else {
                    res.send('User not found');
                }
                
            }
        }
    );
}

const create = (database, req, res) => {
    database.collection(COLLECTION_NAME).insertOne(req.body, (error, result) => {
        if (error) {
            res.send(error.message);
        } else {
            if (result) {
                res.send(result.insertedId);
            } else {
                res.send('Could not get Social User');
            } 
        }  
    });
}

export {findSocialUser, findById, create}