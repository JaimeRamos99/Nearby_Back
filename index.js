const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const firebaseConfig = require('./Config')
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
app.listen(3001);
app.use(bodyParser.json())
app.use(router)
console.log('server started on port 3001');
firebase.initializeApp(firebaseConfig);
router.post('/createUserEmailPassword/:nombre/:email/:usuario/:password', async function (req, res) {
    console.log("se conectaron a /createUserEmailPassword/:nombre/:email/:usuario/:password")
    let email = req.params.email
    let password = req.params.password
    let nombre = req.params.nombre
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
        result.user.updateProfile({
            displayName: nombre
        })
        const configuracion = {
            url: 'http://localhost:3001/'
        }
        result.user.sendEmailVerification(configuracion).catch(err => {
            console.log(err)
        })
        firebase.auth().signOut()
    }).catch(err => {
        console.error(err)
    })
    res.json("Done!")
})
router.get('/login/:email/:password', async function (req, res) {
    console.log("se conectaron a /login/email/password")
    let email = req.params.email
    let password = req.params.password
    firebase.auth().signInWithEmailAndPassword(email, password).then(result => {//la contraseña si se guarda de algún extraño modo XD
        if (result.user.emailVerified) {
            res.json("ingreso exitoso!")
        } else {
            res.json("no se ha verificado la cuenta.")
        }
    })
})