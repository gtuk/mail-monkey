const assert = require('assert')

const MailMonkey = require('../index.js')

describe('Mail Monkey', function () {
  describe('Constructor', function () {
    it('should return exposed module', function () {
      const mailMonkey = MailMonkey()

      assert.strictEqual(typeof mailMonkey.smtpServer, 'object')
      assert.strictEqual(typeof mailMonkey.webServer, 'object')
      assert.strictEqual(typeof mailMonkey.config, 'object')
      assert.strictEqual(typeof mailMonkey.shutdown, 'function')
      assert.strictEqual(typeof mailMonkey.close, 'function')
      assert.strictEqual(typeof mailMonkey.start, 'function')
    })

    it('should accept custom config', function () {
      const mailMonkey = MailMonkey(
        {
          smtpPort: 1026,
          uiPort: 3030,
          verbose: true
        }
      )

      assert.strictEqual(mailMonkey.config.smtpPort, 1026)
      assert.strictEqual(mailMonkey.config.uiPort, 3030)
      assert.strictEqual(mailMonkey.config.verbose, true)
    })
  })
})
