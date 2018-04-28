import {ObjectID} from 'mongodb';


export default {
    redux: {
        base: "Redux_Course",
        getPost:  (id, db) => {
            const idObj = { '_id': new ObjectID(id)};
            db.collection('blog-posts').findOne(idObj, (err, results) => {
                if (err) {
                    return {'err': err};
                } else {
                   return {'res': results};
                }
            })
        },
        getPosts: async (db) => {
            return db.collection('blog-posts').find()
                .limit(40)
                .toArray((err, results) => {
                    if (err) {
                        return {'err': err};
                    } else {
                        return {'res': results};
                    }
                });
            
                return results;
            
        },
        addPost: (post, db) => {
            db.insert(post, (err, newPost) => {
                if (err) {
                    return {'err': err};
                } else {
                    return  {'res': newPost.ops[0]};
                }
            });
        }
    }
}