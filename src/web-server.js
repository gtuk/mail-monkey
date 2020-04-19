const path = require('path')
const express = require('express')

const emailService = require('./email-service')

module.exports = function (config) {
  const module = {}

  module.app = express()

  let server = null

  module.app.use(express.static(path.join(__dirname, '/../public/')))

  module.app.get('/', function (req, res) {
    res.sendfile(path.join(__dirname, '/../public/index.html'))
  })

  module.app.get('/api/emails/:id/html', function (req, res) {
    const email = emailService.getEmailbyId(req.params.id)

    if (typeof email !== 'undefined' && email !== null) {
      res
        .set('Content-Type', 'text/html')
        .end(email.html)
    } else {
      res.sendStatus(404)
    }
  })

  module.app.get('/api/emails/:id/attachments/:partId', function (req, res) {
    const attachment = emailService.getAttachmentByEmailIdAndPartId(req.params.id, req.params.partId)
    console.log(attachment)
    if (attachment == null) {
      res.sendStatus(404)
    } else {
      res
        .status(200)
        .set('Content-disposition', 'attachment; filename=' + attachment.filename)
        .set('Content-Type', attachment.contentType)

      res.end(attachment.content, 'binary')
    }
  })

  module.app.get('/api/emails', function (req, res) {
    const emails = emailService.getEmails()

    res.json(emails)
  })

  module.app.delete('/api/emails/:id', function (req, res) {
    emailService.removeEmailById(req.params.id)

    res.sendStatus(204)
  })

  module.app.post('/api/emails/relay/:id', function (req, res) {
    const email = emailService.getEmailbyId(req.params.id)

    if (typeof email !== 'undefined' && email !== null) {
      emailService.relayEmail(email, config, function (err) {
        if (err) {
          res.status(500)
          res.json({
            message: `Couldn't relay email. ${err.message}`
          })
        } else {
          res.sendStatus(204)
        }
      })
    } else {
      res.sendStatus(404)
    }
  })

  module.start = function () {
    server = module.app.listen(config.uiPort, function () {
      console.log(`Webinterface listening on port ${config.uiPort}!`)
    })
  }

  module.close = function (callback) {
    server.close(function () {
      console.log('Web server closed!')
      callback()
    })
  }

  return module
}
