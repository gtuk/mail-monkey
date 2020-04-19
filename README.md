# Mail Monkey

Mail Monkey is a simple application to test your emails during development.

![mail-monkey](https://raw.github.com/gtuk/mail-monkey/master/screenshot.png)

## Install

    $ npm install -g gtuk/mail-monkey#master
    
## Run & Configure

    $ mail-monkey --help
    Usage: mail-monkey [options]
    
    Options:
      -V, --version                              output the version number
      --smtp-port <port>                         SMTP port to catch emails [1025] (default: 1025)
      --smtp-host <port>                         SMTP host to catch emails [false] (default: false)
      --ui-port <port>                           UI port for the webinterface [3000] (default: 3000)
      --verbose                                  If set the stmp server will use its internal logger [false] (default: false)
      --relay                                    If set and the required relay options are specified you can relay the messages to a third party email server.  (default: false)
      --relay-host <relayHost>                   The address of the server you want to relay the email to. (default: false)
      --relay-port <relayPort>                   The port of the server you want to relay the email to. (default: false)
      --relay-secure                             If set the connection will only use TLS. If not set, TLS may still be upgraded to if available via the STARTTLS command. (default: false)
      --relay-require-tls                        If set and replay-secure is not set, it forces nodemailer to use STARTTLS even if the server does not advertise support for it. (default: true)
      --relay-auth-username <relayAuthUsername>  The username for the relay email third party email server (default: false)
      --relay-auth-password <relayAuthPassword>  The username for the relay email third party email server. (default: false)
      -h, --help                                 output usage information

    $ mail-monkey --ui-port 8080
    SMTP server listening on port 1025!
    Webinterface listening on port 8080!


#### TODO

 - Improve test coverage
 - Extend README
 - Publish to npm
 - Migrate frontend code to vue.js

