var express = require('express');
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
            id: {
                type: DataTypes.BIGINT,
                field: 'id',
                autoIncrement: true,
                primaryKey: true
            },
            nume: {
                type: DataTypes.STRING,
                field: 'nume',
                notNull: true,
                validate: {
                    notEmpty: true
                }
            },
            prenume: {
                type: DataTypes.STRING,
                field: 'prenume',
                notNull: true,
                validate: {
                    notEmpty: true
                }
            },
            email: {
                type: DataTypes.STRING,
                field: 'email',
                unique: true,
                notNull: true,
                validate: {
                    isEmail: true,
                    notEmpty: true
                }
            },
            password: {
                type: DataTypes.STRING,
                field: 'password',
                notNull: true,
                validate: {
                    min: 6,
                    notEmpty: true
                }
            },
            data_nastere: {
                type: DataTypes.DATEONLY,
                field: 'data_nastere',
                allowNull: true,
                validate: {
                    isDate: true
                }
            },
            facebook: {
                type: DataTypes.STRING,
                field: 'facebook',
                validate: {
                    isUrl: true
                }
            },
            poza: {
                type: DataTypes.STRING,
                field: 'poza',
                validate: {
                    isUrl: true
                }
            },
            last_token: {
                type: DataTypes.STRING,
                field: 'lastToken'
            },
            type: {
                type: DataTypes.STRING,
                validate: {
                    isIn: [['child', 'parent']]
                }
            },
            reference: {
                type: DataTypes.STRING
            },
            parentId: {
                type: DataTypes.BIGINT
            }
        }, {
            instanceMethods: {
                validPassword: function(password) {
                    return bcrypt.compareSync(password, this.password);
                }
            },
            classMethods: {

            },
            getterMethods: {
                email: function () {
                    return this.getDataValue('email');
                }
            },
            setterMethods: {
                password: function(val) {
                    this.setDataValue('password', bcrypt.hashSync(val, bcrypt.genSaltSync(8), null))
                }
            }
        }
    );
};
