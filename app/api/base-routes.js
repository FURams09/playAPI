import { ObjectID } from 'mongodb';

const BaseRoutes = (app, mongoDB) => {
    //https://medium.freecodecamp.org/building-a-simple-node-js-api-in-under-30-minutes-a07ea9e390d2
    const BASE_DIRECTORY = '/base';
    var db = mongoDB.db("Base_API");
    app.get(BASE_DIRECTORY, (req, res) => {
        res.send('<h3>Hooked Up</h3>');
    });

    app.post(BASE_DIRECTORY + '/notes', (req, res) => {
        console.log(req.body);
        const note = { text: req.body.body, titel: req.body.title};
        db.collection('blog-posts').insert(note, (err, response) => {
            if (err) {
                res.send({ 'error': err});
            } else {
                res.send({ 'success': response.ops[0]})
            }
        });
    });

    app.get(BASE_DIRECTORY + '/notes/:id', (req, res) => {
        const details = { '_id': new ObjectID(req.params.id)}

        db.collection('blog-posts').findOne(details, (err, post) => {
            if (err) {
                res.send({ 'error': err});
            } else {
                res.send(post);
            }
        })
    });

    app.delete(BASE_DIRECTORY + '/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('blog-posts').remove(details, (err, item) => {
          if (err) {
            res.send({'error': err});
          } else {
            res.send('Note ' + id + ' deleted!');
          } 
        });
      });

      app.put(BASE_DIRECTORY + '/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const note = { text: req.body.body, title: req.body.title };
        db.collection('blog-posts').update(details, note, (err, result) => {
          if (err) {
              res.send({'error': err});
          } else {
              res.send(note);
          } 
        });
      });

};

export default BaseRoutes;