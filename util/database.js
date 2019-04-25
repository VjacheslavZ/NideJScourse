const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
   MongoClient.connect(
      'mongodb+srv://Vjacheslav:zxcv1234@cluster0-e2moq.mongodb.net/test?retryWrites=true'
   )
      .then(client => {
         console.log('MongoDB connected');
         callback(client);
      })
      .catch(err => console.log(err));
};

module.exports = mongoConnect;
