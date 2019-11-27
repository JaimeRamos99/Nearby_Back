const MongoClient = require('mongodb').MongoClient;
//const ObjectId = require('mongodb').ObjectId
class Mongohandler {
    constructor() {
        this.client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = 'nearby-beta'
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.client.connect(err => {
                if (err) {
                    reject(err)
                }
                console.log('Connected')
                resolve(this.client.db(this.dbName))
            })
        })
    }
    async nuevoUsuario(name, email, user, pass) {
        return this.connect().then(db => {
            return db.collection('users').insertOne({ nombre: name, correo: email, usuario: user, contraseña: pass });
        })
    }
}
module.exports = new Mongohandler()