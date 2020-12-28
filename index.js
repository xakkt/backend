const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('./config/database')
const path = require('path')
var { flash } = require('express-flash-message');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./config/swagger.json')
var session = require('express-session')
const PORT = process.env.PORT || 4000
const app = express();
let ejs = require('ejs')
var cors = require('cors')
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(cors())
var moment = require('moment');
//var moment = require('moment-timezone');
//moment().tz("America/Los_Angeles").format('ha z');
//moment.tz.setDefault("America/New_York");
var sess = {
  secret: 'keyboard cat',
  saveUninitialized: true,
  cookie:{maxAge:3600000000}
}
/*if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}*/

app.use(session(sess))

app.use(function(req, res, next) {
  res.locals.user = 'xakkt';
  next();
});


app.use(flash({ sessionKeyName: 'xakktFlashMessages' })); 
const adminRoute = require('./routes/admin')
const frontendRoute = require('./routes/frontend')
const mobileApi = require('./routes/api')
app.use(bodyParser.urlencoded({ extended: true }))
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
let ejsOptions = {
  // delimiter: '?', Adding this to tell you do NOT use this like I've seen in other docs, does not work for Express 4
  async: true
};

// The engine is using a callback method for async rendering
app.engine('ejs', async (path, data, cb) => {
  try{
    let html = await ejs.renderFile(path, data, ejsOptions);
    cb(null, html);
  }catch (e){
    cb(e, '');
  }
});
app.locals.moment = require('moment');

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('trackrider', function (data) {
    io.emit('ridingpoints', data);
  });

});
//  app.get('/',(req, res)=> {
//        return  res.render('frontend/index')
//   })
//   app.get('/about',(req, res)=> {
//     return  res.render('frontend/about')
// })
// app.get('/contact',(req, res)=> {
//   return  res.render('frontend/contact')
// })


app.use('/admin', adminRoute);
app.use('/', frontendRoute);



app.use('/api/v1', mobileApi);



server.listen(PORT, () => console.log(`Listening on ${PORT}`));
