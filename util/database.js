const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
   MongoClient.connect(
      'mongodb+srv://Vjacheslav:zxcv1234@cluster0-e2moq.mongodb.net/test?retryWrites=true'
   )
      .then(client => {
         console.log('MongoDB connected');
         _db = client.db();
         callback();
      })
      .catch(err => {
         console.log(err);
         throw err;
      });
};

const getDb = () => {
   if (_db) {
      return _db;
   }
   throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
