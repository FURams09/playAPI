import express from 'express';
import cors from 'cors';
import Routes from './api';
import graphqlHTTP from 'express-graphql';
import schema from './graphql/Schema';
import { Connect } from './db/db';

// INIT SERVER
const PORT = 8000;
const app = express();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/json' }));

app.use(cors({ origin: 'http://localhost:8080' })); // 8080 is the default react dev port

Connect()
  .then((store) => {
    // REGISTER ROUTES

    app.use('/base', Routes.BaseRoutes({
      db: store.mongoDB.db('Base_API'),
      redis: store.redis,
    }));
    app.use('/redux', Routes.ReduxCourse({
      db: store.mongoDB.db('Redux_Course'),
      redis: store.redis,
    }));

    // HOOKS IN GRAPHQL
    app.use('/graphql/react_redux', graphqlHTTP(req => {
      return ({
        schema,
        context: {
          db: store.mongoDB.db('Redux_Course'),
          redis: store.redis,
        },
        graphiql: true,
      });
    }));
    // START SERVER
    app.listen(PORT, (err, unknown) => {
      if (err) {
        console.log(`Error Loading Server:\n${err}`);
      }
      console.log(`Listening for Dev request at http://localhost:${PORT}/`);
    });
  })
  .catch(err => {
    console.log(err);
  });
