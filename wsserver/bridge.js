//
// bridge.js
//
// usage:
// 
// $ npm install ws
// $ node bridge.js
// 

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3001}); 
var connections = [];
var masterconn = null;

wss.on('connection', function (ws) {
  connections.push(ws);
  ws.on('close', function () {
    connections = connections.filter(function (conn, i) {
      return (conn === ws) ? false : true;
    });
    if(ws == masterconn){
      masterconn = null; 
    }
  });

  ws.on('message', function (message,flags) {
    if(flags.binary){
      for(var cnt1=0;cnt1 < message.length; cnt1++){
        console.dir("bynarydata_"+cnt1+":"+message[cnt1]);
      }
      if((masterconn != null)&&(masterconn.readyState == 1)){
        masterconn.send(message);
      }
    }else{
      console.log("message received: "+message);
      if(message == "ping"){
        ws.send("ack");
      }else if(message == "master"){
        masterconn = ws;
        ws.send("master ack");
        console.log("master: "+ws.uid);
      }else{
        if((masterconn != null)&&(masterconn.readyState == 1)){
          masterconn.send(message);
        }
      }
    }
  });

  setInterval(function(){
    connections.forEach(function (con, i) {
      if(con.readyState == 1){
         con.ping("p");
      }else{
         console.log("ping failed:"+i);
      }
    });
  },5000);
});



