
const COLLECTION_NAME = "user-groups";

const listUserGroupOfUser = (database, req, res) => {
    const user = req.params.userEmail;
    database.collection(COLLECTION_NAME).findOne({users: {$all:[user]}},
        (error, doc) => {   
            if (error) {
                res.send(error.message);
            } else {
                if (doc) {
                    res.send(doc);
                } else {
                    res.send('User Group not found');
                }
                
            }
        }
    );
}

export {listUserGroupOfUser}