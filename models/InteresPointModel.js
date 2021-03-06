module.exports = function(sequelize, DataTypes) {
    return sequelize.define('interesPoint', {
            id: {
                type: DataTypes.BIGINT,
                field: 'id',
                autoIncrement: true,
                primaryKey: true
            },
            interesArea_fk: {
                type: DataTypes.BIGINT,
                field: 'interesarea_fk',
                notNull: true,
                references: {
                    model: 'interesareas',
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
            radius: {
                type: DataTypes.DOUBLE,
                field: 'radius'
            }
        } 
    );
};
