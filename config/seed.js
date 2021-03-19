var seeder = require('mongoose-seed');

// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost:27017/xakkt', function() {

  // Load Mongoose models
  seeder.loadModels([
      'models/banner',
      'models/role',
      'models/permission',
      'models/user',
      'models/department',
      'models/store'
    ]);

  // Clear specified collections
  seeder.clearModels(['Banner','Role', 'Permission','User', 'Store','Department'], function() {
    // Callback to populate DB once collections have been cleared
    setTimeout(function(){ seeder.populateModels(data, function() {
      seeder.disconnect();
    });  }, 10000);
  });
  // seeder.clearModels(['User'], function() {

  //   // Callback to populate DB once collections have been cleared
  //   seeder.populateModels(data, function() {
  //     seeder.disconnect();
  //   });

  // });
});

var data = require('./seeder')
