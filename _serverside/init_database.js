var conf_maria={
    address:'maria.io',
    driver:'org.mariadb.jdbc.Driver',
    url:'jdbc:mysql://localhost:3306/'+database['database'],
    username: database['user'],
    password: database['password'],
    database: database['database']
};

container.deployModule('com.bloidonia~mod-jdbc-persistor~2.1.3', conf_maria);

var conf_redis = {
    'address': 'redis.io',
    'host': 'localhost',
    'port': 6379,
    'encoding': 'UTF-8',
    'auth': '321654'
};

container.deployModule('io.vertx~mod-redis~1.1.4', conf_redis);
