const express = require('express')
const app = express()
const router = express.Router()
const opn = require('opn')

router.get('/',function (req, res, next) {
  req.url='/index.html'
  next()
})

app.use(router)



app.use(express.static('./dist'))

module.exports = app.listen(3001, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + 3001 + '\n')
  opn('http://localhost:3001')
})
