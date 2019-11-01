const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session')
const usersController = require('./controllers/users.js');
const eventsController = require('./controllers/events.js');
require('./db/db');

app.use(session({
    secret:"Some randome string",
    resave:false,
    saveUninitialized:false,
}))

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:false}));

app.use('/events',eventsController);
app.use('/auth',usersController);



app.get('/',(req,res)=>{
    console.log('Home Page Hit')
    console.log(req.session,'home route')
    res.render('index.ejs',{
        message: req.session.message,
        logOut: req.session.logOutMsg,
        logged:req.session.logged
    })
})

app.listen(3000,()=>{
    console.log('server is lighting up ')
})