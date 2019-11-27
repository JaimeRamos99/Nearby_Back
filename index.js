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
router.post('/createUserEmailPassword/:email/:password/:nombre', async function (req, res) {
    console.log("se conectaron")
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