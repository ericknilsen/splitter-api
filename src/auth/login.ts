import jwt from 'jsonwebtoken';
import {findByUsername} from '../api/users';
import {findSocialUser} from '../api/social-users'
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

const loginSocialUser = (database, req, res) => {
    // Read username and password from request body
    const { id, firstName, provider } = req.body;

    findSocialUser(database, req).then(user => {   
        // Generate an access token
        const accessToken = jwt.sign({ username: user.firstName }, accessTokenSecret);
        res.json({
            id: user._id,
            group: user.group,
            accessToken: accessToken
        });
    });
}

export {login, loginSocialUser};