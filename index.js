const tempDirectory = require('temp-dir')
const path = require('path')
const uuidv4 = require('uuid/v4')
const program = require('commander')
const pkg = require('./package.json')

const SmtpServer = require('./src/smtp-server')
const WebServer = require('./src/web-server')

module.exports = function (config) {
  const module = {}

  if (!config) {
    config = program
      .version(pkg.version)
      .option('--smtp-port <port>', 'SMTP port to catch emails [1025]', 1025)
      .option('--smtp-host <port>', 'SMTP host to catch emails [false]', false)
      .option('--ui-port <port>', 'UI port for the webinterface [3000]', 3000)
      .option('--verbose', 'If set the stmp server will use its internal logger [false]', false)
      .option(
        '--relay',
        'If set and the required relay options are specified you can relay the ' +
          'messages to a third party email server. ',
        false
      )
      .option(
        '--relay-host <relayHost>',
        'The address of the server you want to relay the email to.',
        false
      )
      .option(
        '--relay-port <relayPort>',
        'The port of the server you want to relay the email to.',
        false
      )
      .option(
        '--relay-secure',
        'If set the connection will only use TLS. ' +
          'If not set, TLS may still be upgraded to if available via the STARTTLS command.',
        false
      )
      .option(
        '--relay-require-tls',
        'If set and replay-secure is not set, it forces nodemailer to use STARTTLS ' +
          'even if the server does not advertise support for it.',
        true
      )
      .option(
        '--relay-auth-username <relayAuthUsername>',
        'The username for the relay email third party email server',
        false
      )
      .option(
        '--relay-auth-password <relayAuthPassword>',
        'The username for the relay email third party email server.',
        false
      )

    config.parse(process.argv)
  }

  config.tmpdir = path.join(tempDirectory, 'mm-' + uuidv4().toString())
  module.config = config

  module.smtpServer = SmtpServer(module.config)
  module.webServer = WebServer(module.config)

  module.start = function () {
    module.smtpServer.start()
    module.webServer.start()
  }

  module.shutdown = function () {
    console.log('Received shutdown signal, shutting down now...')

    module.close(function () {
      process.exit(0)
    })
  }

  module.close = function (callback) {
    module.webServer.close(function () {
      module.smtpServer.close(function () {
        callback()
      })
    })
  }

  process.on('SIGTERM', module.shutdown)
  process.on('SIGINT', module.shutdown)

  return module
}
