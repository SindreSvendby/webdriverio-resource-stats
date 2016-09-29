var webdriverio = require('webdriverio');
var options = {
    desiredCapabilities: {
        browserName: 'chrome',
        proxy: {
          proxyType: 'MANUAL',
          httpProxy: 'localhost:4129',
          sslProxy: 'localhost:8080'
        }
    }
};

// options.desiredCapabilities.chromeOptions = {
//     args: ['use-mobile-user-agent', 'user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3']
// }


webdriverio
    .remote(options)
    .init()
    .url(process.argv[2])
    .waitForExist('.dawn-plug')
    .end();
