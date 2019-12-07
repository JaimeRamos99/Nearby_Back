const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const firebaseConfig = require('./Config')
const firebase = require("firebase/app");
const bcrypt = require('bcrypt')
const cors = require("cors");
const mongohandler = require('./Mongolib')
const PORT = process.env.PORT || 3000
var whitelist = ['https://nearby.com.co', 'https://www.nearby.com.co/']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback('Not allowed by CORS')
    }
  }
}
require("firebase/auth");
require("firebase/firestore");
app.listen(PORT);
app.use(bodyParser.json())
app.use(cors(corsOptions));
app.use(router)
console.log('server started on port 3001');
firebase.initializeApp(firebaseConfig);
router.get('/', async function (req, res) {
    console.log("hello, you have connected to nearby launching estrategy server")
    res.json("hello, you have connected to nearby launching estrategy server")
})
router.post('/createUserEmailPassword/:nombre/:email/:password/:sex/:edad', async function (req, res) {
    console.log("se conectaron a /createUserEmailPassword/:nombre/:email/:usuario/:password")
    let flag = false
    let email = req.params.email
    let password = req.params.password
    const hashedpassword = await bcrypt.hash(password, 10)
    let nombre = req.params.nombre
    let sex = req.params.sex
    let edad = req.params.edad
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
        result.user.updateProfile({
            displayName: nombre
        })
        const configuracion = {
            url: 'https://nearby.com.co/bienvenido'
        }
        result.user.sendEmailVerification(configuracion).catch(err => {
            console.log("1:" + err)
            flag = true
        })
        firebase.auth().signOut()
    }).catch(err => {
        flag = true
        console.error("2:" + err)
        res.json(err)
    })

    if (!flag) {
        await mongohandler.nuevoUsuario(nombre, email, hashedpassword, sex, edad)
        res.json("Done!")
    }
})
router.get('/login/:email/:password', async function (req, res) {
    console.log("se conectaron a /login/email/password")
    let email = req.params.email
    let password = req.params.password
    firebase.auth().signInWithEmailAndPassword(email, password).then(result => {//la contraseña si se guarda de algún extraño modo XD para cuando vaya a dar sign in
        if (result.user.emailVerified) {
            res.json("ingreso exitoso!")
        } else {
            res.json("no se ha verificado la cuenta.")
        }
    })
})