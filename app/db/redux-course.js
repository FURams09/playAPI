
import { ObjectID } from 'mongodb';

const POST_LIST = 'post_list';
const POST_KEY_PREFIX = 'post:';

const refreshCache = (store, logName = '') => {
  return new Promise((resolve, reject) => {
    store.db.collection('blog-posts').find()
      .limit(40)
      .toArray((err, res) => {
        if (err) {
          reject(new Error(err));
        } else {
          console.log(`Redis Refresh ${logName}`);
          var posts = JSON.stringify(res);
          store.redis.set(
            POST_LIST
            , posts
          );
          resolve(res);
        }
      });
  });
};

export default {
  base: 'Redux_Course',
  getPost: (id, store) => {
    const idObj = { '_id': new ObjectID(id) };
    return new Promise((resolve, reject) => {
      store.redis.get(`${POST_KEY_PREFIX + id}`, (err, reply) => {
        if (err) reject(new Error(err));
        if (reply) {
          console.log('redis');
          resolve(JSON.parse(reply));
        } else {
          store.db.collection('blog-posts').findOne(idObj, (err, res) => {
            if (err) {
              reject(new Error(err));
            } else {
              console.log('Mongo');
              store.redis.set(
                `${POST_KEY_PREFIX + id}`
                , JSON.stringify([res])
                , () => {
                  resolve([res]);
                });
            }
          });
        }
      });
    });
  },
  getPosts: (store) => {
    return new Promise((resolve, reject) => {
      store.redis.get(POST_LIST, (err, reply) => {
        if (err) reject(err);
        if (reply) {
          console.log('redis');
          resolve(JSON.parse(reply));
        } else {
          refreshCache(store, 'Get')
            .then(posts => {
              resolve(posts);
            })
            .catch(err => {
              reject(new Error(err));
            });
        }
      });
    });
  },
  addPost: (post, store) => {
    return new Promise((resolve, reject) => {
      store.db.collection('blog-posts').insert(post, (err, res) => {
        if (err) {
          reject(new Error(err));
        } else {
          let post; let { _id } = res.ops[0];
          refreshCache(store);
          store.redis.set(
            `${POST_KEY_PREFIX + _id}`
            , JSON.stringify([post])
            , () => {
              resolve([post]);
            });
        }
      });
    });
  },
  deletePost: (id, store) => {
    const details = { '_id': new ObjectID(id) };
    return new Promise((resolve, reject) => {
      store.db.collection('blog-posts').remove(details, (err, res) => {
        if (err) {
          reject(new Error(err));
        } else {
          // refresh the redis store. Could probably be done with Redis API once I learn it

          store.db.collection('blog-posts').find()
            .limit(40)
            .toArray((err, res) => {
              if (err) {
                reject(new Error(err));
              } else {
                refreshCache(store, 'Mongo Delete')
                  .then(posts => {
                    resolve(posts);
                  })
                  .catch(err => {
                    reject(new Error(err));
                  });
              }
            });
        }
      });
    });
  },

};
