'use strict'

const http = require('http')
const express = require('express')
const debug = require('debug')('radar:api')
const chalk = require('chalk')

const app = express()

const port = process.env.PORT || 8888
const server = http.createServer(app)

const api = require('./api')

app.use('/radar', api)

// Express error handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

function handlerFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

if (!module.parent) {
  process.on('uncaughtException', handlerFatalError)
  process.on('unhandledRejection', handlerFatalError)

  server.listen(port, () => {
    console.log(`${chalk.green(['[radar-api]'])} server running on  port ${port}`)
  })
}

module.exports = server
