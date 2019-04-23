var express = require ('express')
var app = express();
const hb = require('express-handlebars')
const NoteService = require('./service/noteservice');

var bodyParser = require('body-parser')
var basicAuth = require('express-basic-auth')
const myAuthorizer=require('./auth').myAuthorizer
const path = require('path')

require('dotenv').config();
// const config = require('./config.json')[process.env.NODE_ENV || 'development'];
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

// const router = new Router();nklqzzkznknnka
const NoteRouter = require('./routes/noteroutes');
const service = new NoteService('knex');
const fs = require('fs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('handlebars',hb({defaultLayout : 'main'}));
app.set('view engine','handlebars');

app.use(express.static('assets'))

app.use(basicAuth({
    authorizeAsync: true,
    authorizer: myAuthorizer(knex),
    challenge:true,
}))
const noteService = new NoteService(knex);


app.get('/', (req,res)=>{

    var data = req.params
    res.render("index")

})
// app.post('/test', (req,res) =>{
//     console.log(req.body)
//     console.log(req.body.note)
//     var file=req.body
//     //logic to write into json file
//     console.log(file)
//     // res.send(file);
//     // res.json(file);
//     // res.render(file)
// })

// app.post('/', async (req,res)=>{
//     console.log('aawala',req.body.note)
//    await service.add(req.body.note.user)
//     .then( async(data)=>{
//         console.log('really',data)
//       await  res.json(data)
//     })
// })
app.use('/api/notes', (new NoteRouter(noteService)).router());
app.listen(8080);
