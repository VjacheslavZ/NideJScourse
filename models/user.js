const mongodb = require('mongodb');
const getDb = require('../util/database').getDb();

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('users').insert(this);
    }

    static findById(userId) {
        const db = getDb();
        return db
           .collection('users')
           .findOne({ _id: new ObjectId(userId) })
           .then(user => {
              console.log(err)
           })
           .catch(err => console.log(err))
    }
}

module.exports = User;
