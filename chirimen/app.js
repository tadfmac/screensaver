
// ws
var host = "ws://xxx.net:xxxx";
var ws = new poorws(host);
var status = 0;

ws.onStatusChange = function(sts){
  status = sts;
  if(sts == 0){
    $("#status").text("Connecting...");
  }else if(sts == 1){
    $("#status").text("Connected!");
  }else if(sts == 2){
    $("#status").text("Disconnecting...");
  }else if(sts == 3){
    $("#status").text("Re-Connecting...");
  }
};

ws.onOpen = function(e){
  ws.send("master");
};

ws.onMessage = function(mes){
  if(mes.data == "master ack"){
    console.log("master ack received");
  }else{
    if(mes.data == "clear"){
      clearSprites();      
    }else if(mes.data == "snow"){
      if(snow == true){
        removeSnow();
      }else{
        addSnow();
      }
    }else{
      addSprite(getRandomInt(0,fruitsnames.length));
    }
  }
};

function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}

// Animation
var stage = new PIXI.Stage(0x000000);
var width = window.innerWidth;
var height = window.innerHeight;
var renderer = PIXI.autoDetectRenderer(width, height, {autoResize: true});
document.getElementById("pixiview").appendChild(renderer.view);

function initWall(){
  var wall = PIXI.Texture.fromImage('./img/wall.jpg');
  var wsprite = new PIXI.Sprite(wall);
  wsprite.position.x = width / 2;
  wsprite.position.y = height / 2;
  wsprite.anchor.x = 0.5;
  wsprite.anchor.y = 0.5;
  stage.addChild(wsprite);
}

initWall();

var xmascontainer = new PIXI.Container();
stage.addChild(xmascontainer);

// 画像からスプライトオブジェクトを作る
var sprites = [];

var fruitsnames = [
'./img/bell1.png',
'./img/santa1.png',
'./img/santa2.png',
'./img/santa3.png',
'./img/tonakai1.png',
'./img/tonakai2.png',
'./img/tree1.png',
'./img/tree2.png'
];

function addSprite(cnt){
  var ftex = PIXI.Texture.fromImage(fruitsnames[cnt%fruitsnames.length]);
  var fsprite = new PIXI.Sprite(ftex);
  fsprite.position.x = Math.random() * width;
  fsprite.position.y = Math.random() * height;
  fsprite.anchor.x = 0.5;
  fsprite.anchor.y = 0.5;
  fsprite.speed = Math.random();
  sprites.push(fsprite);
  xmascontainer.addChild(fsprite);
  blinkStart();
}

function clearSprites(){
  for(var i=0;i < sprites.length; i++){
    xmascontainer.removeChild(sprites[i]);  
  }
}

var snow = false;

requestAnimationFrame(animate);

function animate(){
  requestAnimationFrame(animate); // 次の描画タイミングでanimateを呼び出す

  // スプライトを流す
  for(var cnt=0;cnt <sprites.length;cnt++){
    sprites[cnt].rotation += (sprites[cnt].speed / 10);
    sprites[cnt].position.x += (sprites[cnt].speed * 10);
    if(sprites[cnt].position.x > (width + 100)){
      sprites[cnt].position.x = -200;
      sprites[cnt].position.y = Math.random() * height;
      sprites[cnt].speed = Math.random();
    }
  }

  if(snow == true){
    for(cnt=0;cnt <MAX_SNOW;cnt++){
      var scale = snowimgs[cnt].scale.x;
      snowimgs[cnt].position.x += scale * (Math.random() - 0.5) * 4;
      snowimgs[cnt].position.y += (scale * 3) + 1;
      if(snowimgs[cnt].position.y > 1024){
        snowimgs[cnt].position.y = -10;
      }
    }
  }
  renderer.render(stage);   // 描画する
}

// snow
var texture = PIXI.Texture.fromImage('img/snow2.png');
var MAX_SNOW = 300;
var snowimgs = [];

for(var cnt=0;cnt < MAX_SNOW;cnt ++){
  snowimgs.push(new PIXI.Sprite(texture));
  snowimgs[cnt].position.x = Math.random() * width;
  snowimgs[cnt].position.y = Math.random() * height;
  snowimgs[cnt].anchor.x = 0.5;
  snowimgs[cnt].anchor.y = 0.5;
  var base = Math.random();
  snowimgs[cnt].alpha = (base/2) + 0.4;
  snowimgs[cnt].scale.x = base/2;
  snowimgs[cnt].scale.y = base/2;
}

function addSnow(){
  snow = true;
  for(var cnt=0;cnt < MAX_SNOW;cnt ++){
    stage.addChild(snowimgs[cnt]);
  }
}

function removeSnow(){
  snow = false;
  for(var cnt=0;cnt < MAX_SNOW;cnt ++){
    stage.removeChild(snowimgs[cnt]);
  }
}

// resizeing
var resizeTimer = false;
$(window).resize(function() {
    if (resizeTimer !== false) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(function() {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.resize(width, height);
    }, 200);
});

// Lチカ (For CHIRIMEN)
if(navigator.mozGpio){
  var pnums = [199,244,243,246,245];
  for(var i= 0;i< pnums.length; i++){
    navigator.mozGpio.export(pnums[i]);
    delay(100);
  }
  var val,c = 0;
  var timer = null;

  function blinkStart(){
    if(timer){
      clearInterval(timer);
    }
    timer = setInterval(function(){
      val ^= 1;  
      navigator.mozGpio.setValue(pnums[c],val);
      if(val == 0){
        c=(c+1)%pnums.length;
      }
    },100);
  }

  function blinkStop(){
    if(timer){
      clearInterval(timer); 
    }
    timer = null;
  }

  function delay(millisec){
    var start = new Date();
    while((new Date()-start)<millisec);
  }

  function toggle(){
    if(timer){
      blinkStop();
    }else{
      blinkStart();
    }
  }
  blinkStart();
}

