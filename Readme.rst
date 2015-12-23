===============
Using casperjs
===============

Installation
-------------

- Install nodejs

- download casperjs and phantomjs

- install them and put there directory in the PATH

Post install configuration
---------------------------

- To make Casper run with phantomjs 2.0 =>

  + changed the version function in bootstrap.js

  .. Code:: javascript

      (function(version) {
        // required version check
        if (phantom.casperEngine === 'phantomjs') {
          if (version.major === 1) {
            if (version.minor < 9) {
              return __die('CasperJS needs at least PhantomJS v1.9 or later.');
            }
            if (version.minor === 9 && version.patch < 1) {
              return __die('CasperJS needs at least PhantomJS v1.9.1 or later.');
            }
          } else if (version.major === 2) {
            // No requirements yet known
          } else {
            return __die('CasperJS needs PhantomJS v1.9.x or v2.x');
          }
        }
      })(phantom.version);

  + Added a block of code in boostrap.js

  .. Code:: javascript

      var system = require('system');
      var argsdeprecated = system.args;
      argsdeprecated.shift();
      phantom.args = argsdeprecated;

Using a proxy
--------------

+ Run fiddler listening on port 8888

+ Launch casper with line

::

  D:\Programs\casperjs\bin\casperjs.exe --proxy=localhost:8888 .\testcasper.js

Managing Cookies
----------------

*WARNING:* phantom.addCookie() accept only one cookie object per call.

- Reading cookies from file:

.. Code:: javascript

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

- Saving cookies to file:

.. Code:: javascript

    casper.then(function() {
      cookiesJsn = JSON.stringify(phantom.cookies);
      console.log("get cookies: " + cookiesJsn);
      fs.write(cookieFilename,cookiesJsn,'w');
    });

Passing parameters to script with casper cli
--------------------------------------------

.. Code:: javascript

    var login = "toto"
    var password = "titi"
    if (casper.cli.has('login')) {
      login = casper.cli.get('login');
    }

    if (casper.cli.has('password')) {
      password = casper.cli.get('password');
    }

    casper.echo("Login = " + login + ", Password = " + password)

Write Casper steps
------------------

Casper is asynchronous , thus it's better to use waitSomething for all steps.
For instance waitUntilVisible("id") for the element to click/fill/read.

.. Code:: javascript

    casper.start('http://www.tomsguide.fr/');

    casper.waitUntilVisible('#usrSignin', function clickOnConnect() {
        this.mouseEvent('mouseover', '#usrSignin');
        this.click('#usrSignin');
    });

    casper.waitUntilVisible('.login-form',...

Investigation on targeted page
-------------------------------

- Use of Chrome webdevelopper

- Use of Casper debugHTML function:

.. Code:: javascript

    casper.start('http://www.tomsguide.fr/', function() {
        this.echo(this.getTitle());
        this.debugHTML('#usrSignin', true);
        this.mouseEvent('mouseover', '#usrSignin');
        this.debugHTML('#usrSignin', true);
        this.click('#usrSignin');
    });

    <span id="usrSignin" class="js-referer bom-omniture-tl crLink" data-omniture-community-context="Sign in/Sign up from header" onmouseover="BOM.Utils.decodeLiveAndWrap('aHR0cDovL3d3dy50b21zZ3VpZGUuZnIvY29tbXVuYXV0ZS9sb2dpbg==', this);" data-href="#">Se connecter / S'enregistrer</span>
    <a id="usrSignin" class="js-referer bom-omniture-tl crLink" data-omniture-community-context="Sign in/Sign up from header" data-href="#" href="http://www.tomsguide.fr/communaute/login"><span>Se connecter / S'enregistrer</span></a>

- Inspect elements within the page with evaluate

.. Code:: javascript

    casper.then(function fillLoginForm() {
      var forms = this.evaluate(function evaluateLoginPage() {
        var forms = document.querySelectorAll("form");
        var values = Array.prototype.map.call(forms, function mapForms(obj) {
          return obj.outerHTML;
        });
        return values;
      });
      utils.dump(forms);
    });

Note on html/cookies
--------------------

- It's possible to set multiple class on an element

.. Code:: html

    <h1 class="class1 class2 class3">
