module.exports = function(sequelize, DataTypes) {
    return sequelize.define('locationPoint', {
            id: {
                type: DataTypes.BIGINT,
                field: 'id',
                autoIncrement: true,
                primaryKey: true
            },
            user_fk: {
                type: DataTypes.BIGINT,
                field: 'user_fk',
                notNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            longitude: {
                type: DataTypes.DOUBLE,
                field: 'longitude',
                notNull: true
            },
            latitude: {
                type: DataTypes.DOUBLE,
                field: 'latitude',
                notNull: true
            },
            createdDate: {
                type: DataTypes.DATEONLY,
                field: 'createdDate',
                notNull: true
            }
        } 
    );
};
