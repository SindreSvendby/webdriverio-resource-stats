var proxy = require("http-proxy-simple").createProxyServer({
    host: "0.0.0.0",
    port: 4129
});

proxy.on("http-intercept-request", function (cid, request, response, remoteRequest, performRequest) {
   //console.log("proxy: " + cid + ": HTTP intercept request");
   performRequest(remoteRequest);
});


let nrOfRequest = 0;
let bytesInRequest = 0;
proxy.on("http-intercept-response", function (cid, request, response, remoteResponse, remoteResponseBody, performResponse) {

  console.log("Request nr", ++nrOfRequest);
  bytesInRequest = bytesInRequest + remoteResponseBody.length;
  console.log('Bytes: ', bytesInRequest);
  console.log('Bytes / 1024, (KB) ', bytesInRequest/1024);
  console.log('Bytes / 1024 / 1024, (MB) ', bytesInRequest/1024/1024);

  performResponse(remoteResponse, remoteResponseBody);
});
