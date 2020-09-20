var seeder = require('mongoose-seed');

// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost:27017/latest_xakkt', function() {

  // Load Mongoose models
  seeder.loadModels([
      'models/setting'
  ]);

  // Clear specified collections
  seeder.clearModels(['Setting'], function() {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });

  });
});

var data = require('../seeder/')
