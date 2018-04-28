import { ObjectID } from 'mongodb';
import BodyParser from 'body-parser';
import dbCalls from '../db/db';

const ReduxBlog =  function (app, mongoDB) {
    const BASE_URL= "/Redux";
    var db = mongoDB.db("Redux_Course");


    app.get(BASE_URL, (req, res) => {
        res.send(dbCalls.redux.base);
    })

    app.get(BASE_URL + '/posts', async (req, res) => {
        try {
            let resutls = await dbCalls.redux.getPosts(db);
            console.log(results);
            res.send(`results: ${results}`);
            // if (err) {
            //         res.send(err);
            //     } else {
            //         res.send({'success': results});
            //     }
            
        }
        catch (ex) {
            res.send({'server err': ex});
        }
        // db.collection('blog-posts').find()
        // .limit(40)
        // .toArray((err, results) => {
        //     if (err) {
        //         res.send({'error': err});
        //     } else {
        //         res.send(results)
        //     }
        // })
    })

    app.post(BASE_URL + '/posts', (req, res) => {
        const post = { title: req.body.title, category: req.body.category, content: req.body.content};
        const results = dbCalls.redux.addPost(post, db);
        if (results.err) {
            res.send(results);
        } else {
            res.send({'success': results.res});
        }
        // db.collection('blog-posts').insert(post, (err, newPost) => {
        //     if (err) {
        //         res.send({ 'error': err});
        //     } else {
        //         res.send({ 'success': newPost.ops[0]})
        //     }
        // });
    });

    app.get(BASE_URL + '/posts/:id', (req, res) => {
        const results = dbCalls.redux.getPost(req.params.id, db);
        if (results.err) {
            res.send(results);
        } else {
            res.send(results.res)
        }
        
        // const details = { '_id': new ObjectID(req.params.id)}

        // db.collection('blog-posts').findOne(details, (err, post) => {
        //     if (err) {
        //         res.send({ 'error': err});
        //     } else {
        //         res.send(post);
        //     }
        // })
    });

    app.delete(BASE_URL + '/posts/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('blog-posts').remove(details, (err, item) => {
        if (err) {
            res.send({'error': err});
        } else {
            res.send(item);
        } 
        });
    });

    app.post(BASE_URL + '/posts/massAdd', BodyParser.json({type: 'application/json'}),  (req, res) => {
        db.collection('blog-posts').insert(req.body, (err, results) => {
            if (err) {
                res.send({ 'error': err});
            } else {
                res.send({'success': results})
            }
        })
    })
}

export default ReduxBlog;
