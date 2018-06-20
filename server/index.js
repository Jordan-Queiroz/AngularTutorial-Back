const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')
const mongoose = require('mongoose')

// Setting up express sessions
app.use(session({
    secret: 'asdasdqwdasdwadawdasdwads',
    saveUninitialized: false,
    resave: false,
    cookie: { secure: false }
}))

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
        //console.log("Incorrect details");
        res.json({
            success: false,
            message: "Incorrect Details"
        })
    } else {
        // make  a session and set user to logged in.
        req.session.user = email

        console.log("user session: " + req.session.user)
        console.log("Logging you in");

        res.json({
            success: true
        })
    }

})

app.get('/api/isloggedin', (req, res) => {
    res.json({
        status: !!req.session.user
    })
})

app.post('/api/register', async (req, res) => {
    
    const {email, password} = req.body

    const existingUser = await User.findOne({email});

    if (existingUser) {
        res.json({
            success: false,
            message: "Email already in use"
        })

        return
    }

    const user = new User({
        email,
        password
    })

    const result = await user.save();
    console.log(result);
    res.json({
        success: true,
        message: "Welcome!"
    });
})

app.get('/api/data', async (req, res) => {
    console.log("api/data: ", req.session)
    const user = await User.findOne({email: req.session.user})

    if(!user){
        res.json({
            status: false,
            message: 'User was deleted'
        })
        return
    }
    
    res.json({
        status: true,
        email: req.session.user,
        quote: user.quote
    });
})

app.get('/api/logout', (req, res) => {
    req.session.destroy()
    res.json({
        success: true
    })
})

app.listen(1234, () => console.log('Server listening at 1234'))