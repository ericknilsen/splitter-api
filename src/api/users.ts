
const COLLECTION_NAME = "users";

const findByUsername = (database, username) => {
    return new Promise<any>((resolve, reject) => {
        database.collection(COLLECTION_NAME).findOne({username},
            (error, docs) => {   
                if (error) {
                    reject(error.message);
                } else {
                    resolve(docs);
                }
            }
        );
    });
}

export {findByUsername}