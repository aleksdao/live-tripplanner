var seed = require('./tripplanner-seed');

seed()
  .then(function(){
    console.log('db seeded');
  });
