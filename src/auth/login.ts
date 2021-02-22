import jwt from 'jsonwebtoken';

const users = [
    {
        username: process.env.API_USER_NAME,
        password: process.env.API_PASSWORD,
    },
];

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const login = (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username }, accessTokenSecret);

        res.json({
            accessToken
        });
    } else {
        res.send('Username or password incorrect');
    }
}

export {login};