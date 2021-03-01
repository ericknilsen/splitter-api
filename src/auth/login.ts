import jwt from 'jsonwebtoken';
import {findByUsername} from '../api/users';
import { ACCESS_TOKEN_SECRET } from '../utils/constants';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || ACCESS_TOKEN_SECRET;

const login = (database, req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    findByUsername(database, username).then(user => {
        if (user && user.username === username && user.password === password) {
            // Generate an access token
            const accessToken = jwt.sign({ username: user.username }, accessTokenSecret);

            res.json({
                accessToken
            });
        } else {
            res.send('Username or password incorrect');
        }
    });
}

export {login};