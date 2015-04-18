var container = require('vertx/container');

var config={
    address:'mysql.test',
    driver:'com.mysql.jdbc.Driver',
    url:'jdbc:mysql://localhost:3306/test',
    username:'testuser',
    password:'321654',
    database:'test'
};

container.deployModule('com.bloidonia~mod-jdbc-persistor~2.1', config);
