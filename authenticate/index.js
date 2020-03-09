var session = require('express-session')
var MemoryStore = require('memorystore')(session)
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var memorystore = new session.MemoryStore;
app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy

app.use(cookieParser({
    secret: 'derma-aid'
}));

app.use(session({
  name: 'sessionId', //The name of the session ID cookie to set in the response (and read from in the request).
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: memorystore
}))

app.get('/', (req, res) => {
    res.end()
})
app.get('/allSession', (req, res) => {
    memorystore.all((err, sessions) => {
      if(err) console.log(err)
      console.log(sessions)
      res.end()
    })
})
app.get('/login', (req, res) => {
    req.session.user = {'username': `thao_${req.cookies}`}
    res.end()
})
app.get('/logout', (req, res) => {
    let sessionId = req.session.id;
    console.log(sessionId)
    req.session.destroy((err) => {
      if(err)console.log(err)
      res.clearCookie('sessionId')
      console.log('log out')
      res.end()
    });
    // memorystore.destroy((sessionId, (err) => {
    //     if(err) throw err
    //     console.log('you log out')
    //     res.end()
    // }))
})
app.listen(8000)
