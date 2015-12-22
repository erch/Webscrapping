
var casper = require('casper').create({
viewportSize: {
        width: 1024,
        height: 768
   },
  pageSettings: {
         loadImages:  false,         // The WebPage instance used by Casper will
         loadPlugins: false,         // use these settings
         userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
  },
  logLevel: "info",              // Only "level" level messages will be logged
  verbose: true                  // log messages will be printed out to the console
});
var utils = require('utils');
var fs = require('fs');

var cookieFilename = "./cookies.json";

if (fs.exists(cookieFilename)) {
  console.log("setting cookies");
  var cookiesJsn = fs.read(cookieFilename);
  var cookies = JSON.parse(cookiesJsn);
  for(var i = 0; i < cookies.length; i++) {
    phantom.addCookie(cookies[i]);
  }
}

var login = "toto"
var password = "toto"
if (casper.cli.has('login')) {
  login = casper.cli.get('login');
}

if (casper.cli.has('password')) {
  password = casper.cli.get('password');
}

casper.echo("Login = " + login + ", Password = " + password)

casper.start('http://www.tomsguide.fr/');

casper.waitUntilVisible('#usrSignin', function clickOnConnect() {
    this.mouseEvent('mouseover', '#usrSignin');
    this.click('#usrSignin');
});

casper.waitUntilVisible('.login-form', function fillLoginFields() {
  this.fillSelectors('.login-form', {
    'input[name="username"]':    login,
    'input[name="password"]':    password
  }, false);
}, null, 500000);

casper.waitUntilVisible('button.login', function submitLoginForm() {
  this.click('button.login');
},null,500000);

casper.waitUntilVisible('span#myPseudo',function finalCheck() {
  this.echo(this.fetchText('span#myPseudo'));
});

casper.then(function() {
  cookiesJsn = JSON.stringify(phantom.cookies);
  fs.write(cookieFilename,cookiesJsn,'w');
});
casper.run();
