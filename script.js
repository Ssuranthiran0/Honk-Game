var whitelist = ['76.93.180.172', '75.80.178.228']//me + kam
var blacklist = ['76.167.169.131'] // TOMMY IS THE ONLY GUY
var canvas = document.getElementById("canvas");
canvas.width = 1350;
canvas.height = 500;
var c = canvas.getContext("2d");
// variables
var j = 20; // jump height
var g = 1; // gravity good at 0.5
var baseg = g;
var jc = 0; //jump counter
var bl = 3; // buffer length in ticks 1/60 sec
var buffer = 0; // buffer counter
var s = 2 ; // player speed
var f = 1; // friction
var jc = false // jump confirm
var buffer2 = 1; // spam blocker
var bl2 = 5; // spam blocker limit
var termx = 10; // terminal run vel
var termy = 20; // terminal fall vel
var poundj = j; // ground pound speed good at j
var buffer3 = 1;
var bl3 = bl;
var bases = s;
var bl3center = bl3;
var basepause = 60;
var pause = basepause;
var co = false;
var score = 0;
var v = false;
var types = ["teleporter", "landmine",  "knife", "sniper"];
var test = false;
var t = 0;
reset = () => {
  j = 20; // jump height
  g = 0.5; // gravity good at 0.5
  jc = 0; //jump counter
  bl = 3; // buffer length in ticks 1/60 sec
  buffer = 0; // buffer counter
  s = 2 ; // player speed
  f = 1; // friction
  jc = false // jump confirm
  buffer2 = 1; // spam blocker
  bl2 = 5; // spam blocker limit
  termx = 14; // terminal run vel
  termy = 20; // terminal fall vel
  poundj = j; // ground pound speed good at j
  buffer3 = 1;
  bl3 = bl;
  basepause = 60;
  bl3center = bl3;
  co = false;
  score = 0;
  pause = basepause;
  v=false;
  t=0;
}
reset();
var player = {
  x:200,
  y:400,
  xv:0,
  yv:0,
  size:20,
  color:"black",
  tick:function(){
    if (this.y >= canvas.height-this.size*1.5){
        this.yv = 0;
        this.y = canvas.height-this.size*1.5;
    }else{
      if (this.yv>-20){
        this.yv-=g;
      }
      if (this.y-this.yv<=canvas.height-this.size){
        this.y-= this.yv;
      }
    }
    this.x += this.xv;
    if(this.xv!=0){
      this.xv-=f*(this.xv/Math.abs(this.xv))
    }
    if (this.x >= canvas.width-this.size){
      this.x = canvas.width-this.size;
      this.xv = 0;
    }else if (this.x<=0){
      this.x = 0;
      this.xv = 0;
    }
    if(this.xv>termx){
      this.xv = termx;
    }
    bullet_render();
  },
  render:function(){
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.size, this.size)
    c.fill();
  }
}
var b = {
  x:player.x, 
  y:player.y, 
  size:5, 
  speed:20, 
  type:0,
  bool:false
}
var enemy = {
  x:50,
  y:50,
  xv:100,
  yv:0,
  size:20,
  f:0,
  g:10,
  color:"red",
  tick:function(){
    if (this.y >= canvas.height-this.size*1.5){
        this.yv = 0;
        this.y = canvas.height-this.size*1.5;
    }else{
      if (this.yv>-20){
        this.yv-=this.g;
      }
      if (this.y-this.yv<=canvas.height-this.size){
        this.y-= this.yv;
      }
    }
    this.x += this.xv;
    if(this.xv!=0){
      this.xv-=this.f*(this.xv/Math.abs(this.xv))
    }
    if (this.x >= canvas.width-this.size){
      this.xv *= -1;
    }else if (this.x<=0){
      this.xv *= -1;
    }
    if(this.xv>termx){
      this.xv = termx;
    }
    bullet_render();
  },
  render:function(){
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.size, this.size)
    c.fill();
  }
}
var mouse = {
  x:0, 
  y:0
}
clear = () => {
  c.fillStyle = "#99CCFF";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fill();
  c.fillStyle = "#C68767";
  c.fillRect(0, canvas.height-10, canvas.width, 10);
  c.fill();
}
// f you tommy or zachary
var password = "goose"
bullet_render = () => {
  c.fillStyle = "black";
  c.fillRect(b.x, b.y, b.size, b.size)
}
function die(){
  c.fillStyle = "red";
  c.font = "50px Arial";
  c.fillText("Game Over!", canvas.width/2, canvas.height/2);
  co = true;
}
function deathlogic(enemy1){
  let ep = enemy1.size+player.size
  if(player.x > enemy1.x-ep/2 && player.x < enemy1.x+ep/2 && player.y > enemy1.y-ep/2 && player.y < enemy1.y+ep/2){die();}
}
function kill(enemy1){
  let ep = enemy1.size+b.size
  if(b.x > enemy1.x-ep/2 && b.x < enemy1.x+ep/2 && b.y > enemy1.y-ep/2 && b.y < enemy1.y+ep/2 && b.x != player.x &&b.y != player.y){bl3=pause;b.bool=false;score++}
}
set_bullet = (event) => {
  if(types[b.type] != "knife"){
    v=true;
    if (!b.bool){
      mouse.x = event.x;
      mouse.y = event.y;
      b.bool = true;
    }else if(b.x != player.x && b.y != player.y && types[b.type] == "teleporter"){
      b.bool = false;
      player.x = b.x;
      player.y = b.y;
      mouse.x = event.x;
      mouse.y = event.y;
      v=false;
    }
  }else{
    mouse.x = event.x;
    mouse.y = event.y;
  }
}
bullet = () => {
  if(b.bool && types[b.type] != "knife"){
    var slope = 0;
    if(player.x-mouse.x != 0){
      slope = (player.y-mouse.y)/(player.x-mouse.x);
      var angle = Math.atan(slope);
    }else{angle = 0;}
    if (mouse.x > player.x){
      b.x += b.speed * Math.cos(angle);
      b.y += b.speed * Math.sin(angle);
    }else{
      b.x -= b.speed * Math.cos(angle);
      b.y -= b.speed * Math.sin(angle);
    }
    if(b.x > canvas.width || b.y > canvas.height || b.y < 0 || b.x < 0){
      b.x = player.x;
      b.y = player.y;
      v = false;
      b.bool = false;
    }
  }
}

fill = (text, vari, y) => {
  c.fillText(text+": "+vari, 0, y)
}
var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
  map = {};
  e = e || event; // to deal with IE
  map[e.code] = e.type == 'keydown';
  var key = event.code
  if (map["KeyW"] || map["ArrowUp"]){
    if(jc==false){
      player.y -= j;
      jc++;
      jc = true;
    }
  }
  if(buffer==1){
  if (map["KeyD"] || map["ArrowRight"]){
    player.xv += s;
  }
  if (map["ShiftLeft"]){
    s = 1.5*bases;
    g = baseg/2
  }else{s=bases;g=baseg;}
  if (map["KeyA"] || map["ArrowLeft"]){
    player.xv -= s;
  }
  if (map["KeyS"] || map["ArrowDown"]){
    player.y += poundj;
  }
  if (map["KeyE"] && bl+1<=10){
    bl+=1;
  }
  if (map["KeyQ"] && bl-1>0){
    bl-=1;
  }
  if (map["Space"] && types[b.type] == "landmine"){
    b.bool = false;
    v = true;
  }
  if (map["KeyF"]){
    b.type += 1;
    if(b.type+1 > types.length){
      b.type = 0;
    }
  }
  if(map["Digit1"]){
    b.type = 1-1
  }
  if(map["Digit2"]){
    b.type = 2-1
  }
  if(map["Digit3"]){
    b.type = 3-1
  }
  if(map["Digit4"]){
    b.type = 4-1
  }
  }
}
knife = (event) => {
  if (types[b.type] == "knife"){
    mouse.x = event.x;
    mouse.y = event.y;
    b.x = mouse.x;
    b.y = mouse.y;
    v = true;
    b.bool = false;
  }
}
document.addEventListener("mousedown", set_bullet);
document.addEventListener("mousewheel", set_bullet);
document.addEventListener("mousemove", knife);

loop = () => {
  clear();
  player.render();
  enemy.render();
  c.font = "20px Arial"
  if(buffer2 == 1){jc = false;}
  if(buffer == 1){player.tick();}
  if(buffer3 == 1){enemy.tick();}
  c.fillStyle = "black";
  fill("Buffer Limit", bl, 40);
  fill("Bullet Type", types[b.type], 80);
  fill("Score", score, 60);
  fill("Time Alive", Math.round(t/60), 100);
  c.fillText("WASD or Arrow Keys to play. E and Q to increase or lower buffer. Click to shoot. Thats it.", 0, 20);
  if(types[b.type] == "landmine"){
    b.size = 40;
  }else{b.size=5;}
  buffer+=1;
  buffer2+=1;
  bullet();
  kill(enemy);
  deathlogic(enemy);
  buffer3+=1;
  if (buffer2 >= bl2){buffer2 = 1;}
  if (buffer >= bl){buffer = 1;}
  if (buffer3 >= bl3){buffer3 = 1; bl3=bl3center; p=false;}
  if(co==true && confirm("Press ok to continue.")==true){
    reset();
    player.x = 200;
    player.y = 400;
    co = false;
  }
  if(v==false && types[b.type] != "knife"){
      b.x = player.x;
      b.y = player.y;
  }
  if(types[b.type] == "teleporter"){
    b.color = "blue";
    b.size = 5;
  }else{b.color = player.color}
  if(types[b.type] == "sniper"){
    b.size = 2.5;
    b.speed = 30;
    pause = 5*basepause;
  }else{pause = basepause}
  if(!co){requestAnimationFrame(loop);}
  bullet_render();
  t++;
}
$.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
  data = data.trim().split('\n').reduce(function(obj, pair) {
    pair = pair.split('=');
    return obj[pair[0]] = pair[1], obj;
  }, {});
  for(var i = 0; i<whitelist.length; i++){
    if(data.ip==whitelist[i]){
      loop();
      test = true;
    }
    if(data.ip==blacklist[i]){test=true;}
  }
  if (!test){promp = prompt("Enter the Password: ")}
  if(!test && promp==password){loop();}
});
