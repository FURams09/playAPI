import Redux from '../db/redux-course';
import { Router } from 'express';
const ReduxBlog = function (store) {
  let router = Router();

  router.get('/', (req, res) => {
    res.send(Redux.base);
  });

  router.get('/posts', async (req, res) => {
    Redux.getPosts(store)
      .then(results => {
        res.send(results);
      })
      .catch(err => {
        res.send({ 'err': err });
      });
  });

  router.get('/posts/:id', (req, res) => {
    Redux.getPost(req.params.id, store)
      .then(post => {
        res.send(post[0]);
      })
      .catch(err => {
        res.send({ 'err': err });
      });
  });

  router.post('/posts', (req, res) => {
    const post = { title: req.body.title, category: req.body.category, content: req.body.content };
    Redux.addPost(post, store)
      .then(results => {
        res.send(results[0]);
      })
      .catch(err => {
        res.send({ 'err': err });
      });
  });

  router.delete('/posts/:id', (req, res) => {
    Redux.deletePost(req.params.id, store)
      .then(item => {
        res.send(item);
      })
      .catch(err => {
        res.send({ 'err': err });
      });
  });
  return router;
};

export default ReduxBlog;
