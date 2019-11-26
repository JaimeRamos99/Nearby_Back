const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
app.listen(3000);
app.use(bodyParser.json())
app.use(router)
console.log('server started on port 3000');
router.get('/', async function (req, res) {
    console.log("hola")
})