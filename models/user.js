'use strict';
const { Model } = require('sequelize');
// const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {};
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required.'
                },
                notEmpty: {
                    msg: 'Please provide a first name.'
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name is required.'
                },
                notEmpty: {
                    msg: 'Please provide a last name.'
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you have entered is already in use.'
            },
            validate: {
                notNull: {
                    msg: 'An email address is required.'
                },
                isEmail: {
                    msg: 'Please provide a valid email address.'
                },
                notEmpty: {
                    msg: 'Please provide an email address.'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            // Intially done the hashing in the model and not in the POST route
            // Modified because of the Project's requirments to hash the password via the POST/users route
            /*
            set(val) {
                const pass = bcrypt.hashSync(val, 10);
                this.setDataValue('password', pass);
            }, */
            validate: {
                notNull: {
                    msg: 'A password is required.'
                },
                notEmpty: {
                    msg: 'Please provide a password.'
                }
            },
        }, 
    }, { sequelize, modelName: 'User' });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            }
        })
    };
    return User;
};