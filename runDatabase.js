var database = require('./config/database');

var UserModel = database.import("./models/UserModel");
var InteresAreaModel = database.import('./models/InteresAreaModel');
var InteresPointModel = database.import('./models/InteresPointModel');
var LocationPointModel = database.import('./models/LocationPointModel');
var NotificationModel = database.import('./models/NotificationModel');
var ObjectModel = database.import('./models/ObjectModel');


module.exports = function (isForced) {

    UserModel.sync({force: isForced});
    InteresAreaModel.sync({force: isForced});
    InteresPointModel.sync({force: isForced});
    LocationPointModel.sync({force: isForced});
    NotificationModel.sync({force: isForced});
    ObjectModel.sync({force: isForced});


    UserModel.hasMany(InteresAreaModel, {as: 'InteresAreas', foreignKey: 'parent_fk'});

    UserModel.hasMany(LocationPointModel, {as: 'Locations', foreignKey: 'user_fk'});

    InteresAreaModel.hasMany(InteresPointModel, {as: 'InteresPoints', foreignKey: 'interesArea_fk'});

    UserModel.hasMany(NotificationModel, {as: 'NotificationsFromChild', foreignKey: 'parent_fk'});


};