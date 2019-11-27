const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const firebaseConfig = require('./Config')
const firebase = require("firebase/app");
const bcrypt = require('bcrypt')
const cors = require("cors");
const corsOptions = { origin: "http://localhost:3000" };
const mongohandler = require('./Mongolib')
const PORT=process.env.PORT || 3000
require("firebase/auth");
require("firebase/firestore");
app.listen(PORT);
app.use(bodyParser.json())
app.use(cors(corsOptions));
app.use(router)
console.log('server started on port 3001');
firebase.initializeApp(firebaseConfig);
router.post('/createUserEmailPassword/:nombre/:email/:usuario/:password', async function (req, res) {
    console.log("se conectaron a /createUserEmailPassword/:nombre/:email/:usuario/:password")
    let flag = false
    let email = req.params.email
    let password = req.params.password
    const hashedpassword = await bcrypt.hash(password, 10)
    let nombre = req.params.nombre
    let user = req.params.usuario
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
        result.user.updateProfile({
            displayName: nombre
        })
        const configuracion = {
            url: 'http://localhost:3001/'
        }
        result.user.sendEmailVerification(configuracion).catch(err => {
            res.json("1")
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
        await mongohandler.nuevoUsuario(nombre, email, user, hashedpassword)
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