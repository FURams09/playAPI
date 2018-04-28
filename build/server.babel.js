'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongodb = require('mongodb');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _index = require('./api/index');

var _index2 = _interopRequireDefault(_index);

var _config = require('./db/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//INIT SERVER
var PORT = 8888;
var app = (0, _express2.default)();

//MIDDLEWARE
app.use(_express2.default.urlencoded({ extended: true }));
app.use(_express2.default.json({ type: 'application/json' }));

app.use((0, _cors2.default)({ origin: 'http://localhost:8080' })); //8080 is the default react dev port

_mongodb.MongoClient.connect(_config2.default.url, function (err, database) {
    if (err) return console.log(err);
    //REGISTER ROUTES
    (0, _index2.default)(app, database);

    //START SERVER
    app.listen(PORT, function (err, unknown) {
        console.log('Listening for Dev request at http://localhost:' + PORT + '/');
    });
});
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongodb = require('mongodb');

var BaseRoutes = function BaseRoutes(app, mongoDB) {
    //https://medium.freecodecamp.org/building-a-simple-node-js-api-in-under-30-minutes-a07ea9e390d2
    var BASE_DIRECTORY = '/base';
    var db = mongoDB.db("Base_API");
    app.get(BASE_DIRECTORY, function (req, res) {
        res.send('<h3>Hooked Up</h3>');
    });

    app.post(BASE_DIRECTORY + '/notes', function (req, res) {
        console.log(req.body);
        var note = { text: req.body.body, titel: req.body.title };
        db.collection('blog-posts').insert(note, function (err, response) {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send({ 'success': response.ops[0] });
            }
        });
    });

    app.get(BASE_DIRECTORY + '/notes/:id', function (req, res) {
        var details = { '_id': new _mongodb.ObjectID(req.params.id) };

        db.collection('blog-posts').findOne(details, function (err, post) {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send(post);
            }
        });
    });

    app.delete(BASE_DIRECTORY + '/notes/:id', function (req, res) {
        var id = req.params.id;
        var details = { '_id': new _mongodb.ObjectID(id) };
        db.collection('blog-posts').remove(details, function (err, item) {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send('Note ' + id + ' deleted!');
            }
        });
    });

    app.put(BASE_DIRECTORY + '/notes/:id', function (req, res) {
        var id = req.params.id;
        var details = { '_id': new _mongodb.ObjectID(id) };
        var note = { text: req.body.body, title: req.body.title };
        db.collection('blog-posts').update(details, note, function (err, result) {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send(note);
            }
        });
    });
};

exports.default = BaseRoutes;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _baseRoutes = require('./base-routes');

var _baseRoutes2 = _interopRequireDefault(_baseRoutes);

var _reduxCourse = require('./redux-course');

var _reduxCourse2 = _interopRequireDefault(_reduxCourse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Index = function Index(app, db) {
    //Universal Home
    app.get('/', function (req, res) {
        res.send('Hooked Up');
    });

    (0, _baseRoutes2.default)(app, db);
    (0, _reduxCourse2.default)(app, db);

    //add future calls here
};

exports.default = Index;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongodb = require('mongodb');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _db = require('../db/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReduxBlog = function ReduxBlog(app, mongoDB) {
    var BASE_URL = "/Redux";
    var db = mongoDB.db("Redux_Course");

    app.get(BASE_URL, function (req, res) {
        res.send(_db2.default.redux.base);
    });

    app.get(BASE_URL + '/posts', function (req, res) {
        try {
            _db2.default.redux.getPosts(db).then(function (results) {
                console.log(results);
                res.send('results: ' + results);
            });

            // if (err) {
            //         res.send(err);
            //     } else {
            //         res.send({'success': results});
            //     }
        } catch (ex) {
            res.send({ 'server err': ex });
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
    });

    app.post(BASE_URL + '/posts', function (req, res) {
        var post = { title: req.body.title, category: req.body.category, content: req.body.content };
        var results = _db2.default.redux.addPost(post, db);
        if (results.err) {
            res.send(results);
        } else {
            res.send({ 'success': results.res });
        }
        // db.collection('blog-posts').insert(post, (err, newPost) => {
        //     if (err) {
        //         res.send({ 'error': err});
        //     } else {
        //         res.send({ 'success': newPost.ops[0]})
        //     }
        // });
    });

    app.get(BASE_URL + '/posts/:id', function (req, res) {
        var results = _db2.default.redux.getPost(req.params.id, db);
        if (results.err) {
            res.send(results);
        } else {
            res.send(results.res);
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

    app.delete(BASE_URL + '/posts/:id', function (req, res) {
        var id = req.params.id;
        var details = { '_id': new _mongodb.ObjectID(id) };
        db.collection('blog-posts').remove(details, function (err, item) {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send(item);
            }
        });
    });

    app.post(BASE_URL + '/posts/massAdd', _bodyParser2.default.json({ type: 'application/json' }), function (req, res) {
        db.collection('blog-posts').insert(req.body, function (err, results) {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send({ 'success': results });
            }
        });
    });
};

exports.default = ReduxBlog;
