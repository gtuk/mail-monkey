const fs = require('fs')
const path = require('path')
const simpleParser = require('mailparser').simpleParser
const SMTPServer = require('smtp-server').SMTPServer
const uuidv4 = require('uuid/v4')

const emailService = require('./email-service')

module.exports = function (config) {
  const module = {}

  const server = new SMTPServer({
    logger: config.verbose,
    banner: 'Welcome to Mail Monkey SMTP Server',
    authOptional: true,
    onData (stream, session, callback) {
      const id = uuidv4()
      const chunks = []

      session.saveRawStream = fs.createWriteStream(path.join(config.tmpdir, id.toString() + '.eml'))

      stream.pipe(session.saveRawStream)

      stream.on('data', function (chunk) {
        chunks.push(chunk)
      })

      stream.on('end', () => {
        session.saveRawStream.end()

        const message = Buffer.concat(chunks).toString('utf8')

        simpleParser(message, {}, (err, parsedEmail) => {
          if (err) {
            console.error(err)
          } else {
            parsedEmail.id = id
            emailService.addEmail(parsedEmail)

            callback(null, 'Message queued')
          }
        })
      })
    }
  })

  server.on('error', err => {
    console.log(err)
  })

  module.start = function () {
    fs.mkdirSync(config.tmpdir)

    // start listening
    server.listen(config.smtpPort, config.smtpHost, function () {
      console.log(`SMTP server listening on port ${config.smtpPort}!`)
    })
  }

  module.close = function (callback) {
    fs.rmdirSync(config.tmpdir, { recursive: true })

    server.close(function () {
      console.log('SMTP server closed!')
      callback()
    })
  }

  return module
}
