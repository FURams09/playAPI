import { ObjectID } from 'mongodb';
import { Router } from 'express';
import baseApi from '../db/base-routes';

const BaseRoutes = (store) => {
  let router = Router();
  // https://medium.freecodecamp.org/building-a-simple-node-js-api-in-under-30-minutes-a07ea9e390d2

  router.get('/', (req, res) => {
    res.send(baseApi.baseMsg);
  });

  router.post('/notes', (req, res) => {
    console.log(req.body);
    const note = { text: req.body.body, title: req.body.title };
    baseApi.addNote(note, store)
      .then(note => {
        res.send(note);
      })
      .catch(err => {
        res.send(err);
      });
  });

  router.get('/notes/', (req, res) => {
    baseApi.getNotes(store, req.query.db)
      .then((notes) => {
        res.send(notes);
      })
      .catch((err) => {
        res.send({ 'err': err });
      });
  });

  router.get('/notes/:id', (req, res) => {
    baseApi.getNote(req.params.id, store, req.query.db)
      .then((note) => {
        res.send(note);
      })
      .catch((err) => {
        res.send({ 'err': err });
      });
  });

  router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };

    store.db.collection('blog-posts').remove(details, (err, item) => {
      if (err) {
        res.send({ 'error': err });
      } else {
        res.send('Note ' + id + ' deleted!');
      }
    });
  });

  router.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const note = { text: req.body.body, title: req.body.title };
    store.db.collection('blog-posts').update(details, note, (err, result) => {
      if (err) {
        res.send({ 'error': err });
      } else {
        res.send(note);
      }
    });
  });

  return router;
};

export default BaseRoutes;
