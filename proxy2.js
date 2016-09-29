//  Install npm dependencies first
//  npm init
//  npm install --save url@0.10.3
//  npm install --save http-proxy@1.11.1

var httpProxy = require("http-proxy");
var http = require("http");
var url = require("url");
var net = require('net');


httpContentLenght = 0;
httpsContentLenght = 0;

httpRequests = 0;
httpsRequest = 0;

var server = http.createServer(function (req, res) {
  httpRequests++

  var urlObj = url.parse(req.url);
  var target = urlObj.protocol + "//" + urlObj.host;

  console.log("Request", httpRequests,  target);

  var proxy = httpProxy.createProxyServer({});
  proxy.on("error", function (err, req, res) {
    console.log("proxy error", err);
    res.end();
  });

  proxy.on("proxyRes", function (proxyRes, req, res) {
    if(proxyRes.headers['content-length'] > 0) {
      httpContentLenght += parseInt(proxyRes.headers['content-length'], 10);
    }
    console.log('Length of http requests so far: (MB) ', httpContentLenght / 1024 / 1024);
  });

  proxy.on('open', function (proxySocket) {
    console.log('???????????????????????????????');
    proxySocket.on('data', function() {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    });
  });

  const options = {
    target: target,
  }

  proxy.web(req, res, options);

}).listen(8080);  //this is the port your clients will connect to



var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var getHostPortFromString = function (hostString, defaultPort) {
  var host = hostString;
  var port = defaultPort;

  var result = regex_hostport.exec(hostString);
  if (result != null) {
    host = result[1];
    if (result[2] != null) {
      port = result[3];
    }
  }

  return ( [host, port] );
};

server.addListener('connect', function (req, socket, bodyhead) {
  var hostPort = getHostPortFromString(req.url, 443);
  var hostDomain = hostPort[0];
  var port = parseInt(hostPort[1]);
  console.log("Requesting HTTPS req nr ", ++httpRequests, ' requstdomain', hostDomain, port);

  var proxySocket = new net.Socket();
  proxySocket.connect(port, hostDomain, function () {
      proxySocket.write(bodyhead);
      socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
    }
  );

  proxySocket.on('data', function (chunk) {
    httpsContentLenght += chunk.length;
    console.log('Mottat data over https så langt MB:', httpsContentLenght / 1024 / 1024 );
    socket.write(chunk);
  });

  proxySocket.on('end', function () {
    socket.end();
  });

  proxySocket.on('error', function () {
    socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
    socket.end();
  });

  socket.on('data', function (chunk) {
    proxySocket.write(chunk);
  });

  socket.on('end', function () {
    proxySocket.end();
  });

  socket.on('error', function () {
    proxySocket.end();
  });

});
