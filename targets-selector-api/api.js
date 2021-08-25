'use strict'

const debug = require('debug')('radar:api')
const express = require('express')
const Radar = require('radar')

const api = express.Router()

api.use(express.json())

api.use('*', (req, res, next) => {
  next()
})

api.post('/', (req, res, next) => {
  debug('Soicitud /radar')

  const radar = new Radar(req.body)

  if (radar.targets.length >= 1) {
    const objetive = radar.targets[0]
    debug(objetive)
    res.send(objetive.coordinates)
  } else {
    console.log('no existen objetivos disponibles')
    res.send('no existen objetivos disponibles')
  }
})

module.exports = api
