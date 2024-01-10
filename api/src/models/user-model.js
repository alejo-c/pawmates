import { DataTypes } from 'sequelize'
import { db } from '../database/config.db.js'

export const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    role: {
        type: DataTypes.CHAR,
        allowNull: false,
        defaultValue: '2'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING
    }
})

export const userRoles = { '1': 'Admin', '2': 'Adopter' }

export const getUserById = id => Adopter.findByPk(id)