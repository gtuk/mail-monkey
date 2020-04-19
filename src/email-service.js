const path = require('path')
const nodemailer = require('nodemailer')

let EMAILS = []

module.exports = {
  getEmails: function () {
    return EMAILS
  },

  getEmailbyId: function (id) {
    return EMAILS.find(email => email.id === id)
  },

  addEmail: function (email) {
    EMAILS.push(email)
  },

  removeEmailById: function (id) {
    EMAILS = EMAILS.filter(email => email.id !== id)
  },

  getAttachmentByEmailIdAndPartId: function (emailId, partId) {
    for (const email of EMAILS) {
      for (const attachment of email.attachments) {
        if (email.id === emailId && attachment.partId === partId) {
          return attachment
        }
      }
    }
  },

  relayEmail: function (email, config, callback) {
    const sendEmail = function (transportConfig, mailOptions, callback) {
      const transporter = nodemailer.createTransport(transportConfig)

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err)
          return callback(err)
        }

        console.log('Message sent: ' + info.response)
        callback(null)
      })
    }

    const createRelayMailOptions = function (email) {
      return {
        envelope: {
          from: email.from.text,
          to: email.to.value.map(recipient => recipient.address)
        },
        raw: {
          path: path.join(config.tmpdir, email.id.toString() + '.eml')
        }
      }
    }

    const createRelayTransportConfig = function () {
      const transportConfig = {
        host: config.relayHost,
        port: config.relayPort,
        secure: config.relaySecure,
        requireTLS: config.relayRequireTls
      }

      if (config.relayAuthUsername && config.relayAuthPassword) {
        transportConfig.auth = {
          user: config.relayAuthUsername,
          pass: config.relayAuthPassword
        }
      }

      return transportConfig
    }

    if (config.relay && config.relayHost && config.relayPort) {
      const transportConfig = createRelayTransportConfig()
      const mailOptions = createRelayMailOptions(email)

      sendEmail(transportConfig, mailOptions, function (err) {
        if (err) {
          console.log(err)
          return callback(err)
        }

        callback(null)
      })
    } else {
      return callback(new Error('Relay functionality is not available. Please make sure it is up correctly.'))
    }
  }
}
