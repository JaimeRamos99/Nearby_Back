const MongoClient = require('mongodb').MongoClient;
//const ObjectId = require('mongodb').ObjectId
class Mongohandler {
    constructor() {
        this.client = new MongoClient(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = process.env.DB
        console.log(process.env.MONGO)
        console.log(process.env.DB)
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