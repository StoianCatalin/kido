var database = require('./config/database');

var UserModel = database.import("./models/UserModel");
var InteresAreaModel = database.import('./models/InteresAreaModel');
var InteresPointModel = database.import('./models/InteresPointModel');
var LocationPointModel = database.import('./models/LocationPointModel');
var NotificationModel = database.import('./models/NotificationModel');
var ObjectModel = database.import('./models/ObjectModel');


module.exports = function (isForced) {

    UserModel.sync({force: isForced});
    NotificationModel.sync({force: isForced});
    LocationPointModel.sync({force: isForced});
    InteresPointModel.sync({force: isForced});
    InteresAreaModel.sync({force: isForced});
    ObjectModel.sync({force: isForced});


    UserModel.belongsTo(UserModel, {as: 'parent', foreignKey: 'parentId', sourceKey: 'id'});
    UserModel.hasMany(UserModel, {as: 'childs', foreignKey: 'parentId', targetKey: 'id'});

    UserModel.hasMany(InteresAreaModel, {as: 'interesareas', foreignKey: 'parent_fk'});

    UserModel.hasMany(LocationPointModel, {as: 'locations', foreignKey: 'user_fk'});
    LocationPointModel.belongsTo(UserModel, {foreignKey: 'user_fk'});

    InteresAreaModel.hasMany(InteresPointModel, {as: 'interespoints', foreignKey: 'interesarea_fk'});

    //UserModel.hasMany(NotificationModel, {as: 'notifications', foreignKey: 'parent_fk'});


};