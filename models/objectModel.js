module.exports = function(sequelize, DataTypes) {
    return sequelize.define('object', {
            id: {
                type: DataTypes.BIGINT,
                field: 'id',
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                field: 'name',
                notNull: true
            },
            height: {
                type: DataTypes.DOUBLE,
                field: 'height',
                notNull: true
            },
            width: {
                type: DataTypes.DOUBLE,
                field: 'width',
                notNull: true
            },
            weight: {
                type: DataTypes.DOUBLE,
                field: 'weight',
                notNull: true
            },
            dangerLevel: {
                type: DataTypes.INTEGER,
                field: 'dangerLevel',
                notNull: true
            }
        } 
    );
};
