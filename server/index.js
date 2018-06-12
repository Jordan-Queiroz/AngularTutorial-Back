const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const mongoose = require('mongoose')
mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/angulardb')
    .then(() => console.log('Mogoose up'))

const User = require('./models/users')

app.use(bodyParser.json())

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    const resp = await User.findOne({email, password});

    if(!resp) {
        // user login is incorrect.
        console.log("Incorrect details");
    } else {
        console.log("Logging you in");
        // make  a session and set user to logged in.
    }

    res.send("ok");
})

app.post('/api/register', async (req, res) => {
    
    const {email, password} = req.body
    const user = new User({
        email,
        password
    })

    const result = await user.save();
    console.log(result);
    res.json(result);
})

app.listen(1234, () => console.log('Server listening at 1234'))