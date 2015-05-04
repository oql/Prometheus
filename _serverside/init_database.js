var conf_maria={
    address:'maria.io',
    driver:'org.mariadb.jdbc.Driver',
    url:'jdbc:mysql://localhost:3306/'+database['database.maria'],
    username: database['user.maria'],
    password: database['password.maria'],
    database: database['database.maria']
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

// var conf_mongo = {
//     "address": 'mongo.io',
//     "host": server['host'],
//     "port": database['port.mongo'],
//     "username": <username>,
//     "password": <password>,
//     "db_name": <db_name>,
//     "pool_size": <pool_size>,
//     "use_ssl": <bool>,
//     "read_preference": <e.g. "nearest" or "primary" etecetera>,
//     "use_mongo_types": <bool>,
//     "socket_timeout": <default 60000>,
//     "auto_connect_retry": <default true>
// };
//
// container.deployModule('mongo-persistor', conf_mongo);

// var conf_session = {
//     address: "sesn.mn",
//     timeout: 15 * 60 * 1000,
//     cleaner: "sesn.cln",
//     prefix: "sesn-client."
// };
//
// container.deployModule('com.campudus~session-manager~2.0.1-final', conf_session, function(msg){
//     ;
// });
