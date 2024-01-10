import { DataTypes } from 'sequelize'
import { db } from '../database/config.db.js'

export const Pet = db.define('pet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    type: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    age: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    breed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    photo_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    adoption_status: {
        type: DataTypes.CHAR,
        allowNull: false,
        defaultValue: '1'
    }
})

export const petTypes = { 'C': 'Cat', 'D': 'Dog' }
export const petGenders = { 'M': 'Male', 'F': 'Female' }

export const getPetById = id => Pet.findByPk(id) 