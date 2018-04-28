import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import Routes from './api/index';
import db from './db/config';


//INIT SERVER
const PORT = 8888
const app = express();

//MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(express.json({type: 'application/json'}));

app.use(cors({origin: 'http://localhost:8080'})) //8080 is the default react dev port

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);
    //REGISTER ROUTES
    Routes(app, database);


    //START SERVER
    app.listen(PORT, (err, unknown) => {
        console.log(`Listening for Dev request at http://localhost:${PORT}/`)
    })
})

