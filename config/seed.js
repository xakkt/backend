var seeder = require('mongoose-seed');

// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost:27017/xakkt', function() {

  // Load Mongoose models
  seeder.loadModels([
      'models/banner',
      'models/role',
      'models/permission'
    ]);

  // Clear specified collections
  seeder.clearModels(['Banner','Role', 'Permission'], function() {
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });

  });
  // seeder.clearModels(['User'], function() {

  //   // Callback to populate DB once collections have been cleared
  //   seeder.populateModels(data, function() {
  //     seeder.disconnect();
  //   });

  // });
});

var data = require('./seeder')
