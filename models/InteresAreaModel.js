
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('interesArea', {
            id: {
                type: DataTypes.BIGINT,
                field: 'id',
                autoIncrement: true,
                primaryKey: true
            },
            parent_fk: {
                type: DataTypes.BIGINT,
                field: 'parent_fk',
                notNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            name: {
                type: DataTypes.STRING,
                field: 'name',
                notNull: true
            },
            createdDate: {
                type: DataTypes.DATEONLY,
                field: 'createdDate',
                notNull: true
            },
            updatedDate: {
                type: DataTypes.DATEONLY,
                field: 'updatedDate',
                notNull: true
            }
        } 
    );
};
