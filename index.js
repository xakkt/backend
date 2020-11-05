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
  cookie: {}
}
/*if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}*/

app.use(session(sess))
app.use(flash({ sessionKeyName: 'xakktFlashMessages' })); 
const adminRoute = require('./routes/admin')
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



app.use('/admin', adminRoute);


app.use('/api/v1', mobileApi);



server.listen(PORT, () => console.log(`Listening on ${PORT}`));
