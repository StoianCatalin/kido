module.exports = function(sequelize, DataTypes) {
    return sequelize.define('notification', {
            id: {
                type: DataTypes.BIGINT,
                field: 'id',
                autoIncrement: true,
                primaryKey: true
            },
            parent_fk: {
                type: DataTypes.BIGINT,
                field: 'prent_fk',
                notNull: true,
                references: {
                    model: user,
                    key: 'id'
                }
            },
            child_fk: {
                type: DataTypes.BIGINT,
                field: 'child_fk',
                notNull: true,
                references: {
                    model: user,
                    key: 'id'
                }
            },
            type: {
                type: DataTypes.INTEGER,
                field: 'type',
                notNull: true
            },
            message: {
                type: DataTypes.STRING,
                field: 'message',
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