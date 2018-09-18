import { ObjectID } from 'mongodb';

const NOTE_LIST = 'note_list';
const NOTE_PREFIX = 'note:';

export default {
  baseMsg: '<h3>Hooked Up</h3>',
  getNotes: (store, forceDB) => {
    return new Promise((resolve, reject) => {
      const getNotesFromDB = () => {
        store.db.collection('comments').find()
          .limit(40)
          .toArray((err, res) => {
            if (err) {
              reject(err);
            } else {
              console.log('Mongo');
              var notes = JSON.stringify(res);

              store.redis.set(
                NOTE_LIST
                , notes
                , () => { resolve(res); });
            }
          });
      };
      console.log(forceDB);
      if (forceDB) {
        getNotesFromDB();
      } else {
        store.redis.get(NOTE_LIST, (err, reply) => {
          if (err) reject(err);
          if (reply) {
            console.log('redis');
            resolve(JSON.parse(reply));
          } else {
            getNotesFromDB();
          }
        });
      }
    });
  },
  getNote: (id, store, forceDB) => {
    return new Promise((resolve, reject) => {
      const getNoteFromDB = () => {
        const details = { '_id': new ObjectID(id) };
        store.db.collection('comments').findOne(details, (err, res) => {
          if (err) {
            reject(err);
          } else {
            console.log('Mongo');
            var note = JSON.stringify(res);

            store.redis.set(
              `${NOTE_PREFIX + id}`
              , note
              , () => { resolve(res); });
          }
        });
      };

      if (forceDB) {
        getNoteFromDB();
      } else {
        store.redis.get(`${NOTE_PREFIX + id}`, (err, reply) => {
          if (err) reject(err);
          if (reply) {
            console.log('redis', id);
            resolve(JSON.parse(reply));
          } else {
            getNoteFromDB();
          }
        });
      }
    });
  },
  // working on making this update redis when you stopped
  // check out the res and figure out the api for the _id and the appropriate data to return
  //   addNote: (note, store) => {
  //     return new Promise((resolve, reject) => {
  //       store.db.collection('comments').insert(note, (err, res) => {
  //         if (err) {
  //           reject(err)
  //         } else {
  //           console.log(res)
  //           var note = JSON.stringify(res)

//           // store.redis.set(
//           //     `${NOTE_PREFIX + note.id}`
//           //     , note
//           //     ,() => {resolve(res);} );
//         }
//       })
//     })
//   }
};
