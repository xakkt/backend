const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('./config/database')
const path = require('path')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./config/swagger.json')

const PORT = process.env.PORT || 4000
const app = express();
var cors = require('cors')
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(cors())
var moment = require('moment-timezone');
//moment().tz("America/Los_Angeles").format('ha z');
moment.tz.setDefault("America/New_York");

const userRoutes = require('./routes/user'); 
const storeRoutes = require('./routes/store');
const productRoutes = require('./routes/product');
const productCategoryRoutes = require('./routes/product_category')
const homeRoute = require('./routes/home');
const settingRoute = require('./routes/setting')
const wishlistRoute = require('./routes/wishlist')
const shoppinglistRoute = require('./routes/shoppinglist')
const cartRoute = require('./routes/cart')
const adminRoute = require('./routes/admin')

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
app.use(bodyParser.json({extended: true}));

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
      
    socket.on('trackrider', function(data){
         io.emit('ridingpoints', data);
    });

  });



app.use('/admin',adminRoute);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1',homeRoute);
app.use('/api/v1',storeRoutes);
app.use('/api/v1',cartRoute);
app.use('/api/v1',[shoppinglistRoute,wishlistRoute,settingRoute,productRoutes,productCategoryRoutes]);


server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
