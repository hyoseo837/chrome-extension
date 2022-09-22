import {obs} from "./obstacle.js"

var ang =0;
var rad = 100;
var score = 0;
var scoregage = 0;
var highscore = 0;
var pressed = false;

var cnt= 0;
var obtcnt = 0;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var grd = ctx.createRadialGradient(0,0,0,0,0,0);

var obstacles = [];
var delList = [];

function initialize(high){
    ang =0;
    rad = 100;
    score = 0;
    scoregage = 0;
    pressed = false;
    delList = [];
    obstacles = [];
    if (high > highscore){
        highscore = high;
        chrome.storage.sync.set({record: high}, function() {
            console.log('Value is set to ' + high);
        });
    }
}

function obsUpdate(size){
    delList = [];
    for (let index = 0; index < obstacles.length; index++) {
        const element = obstacles[index];

        if (element.checkHit(size/2 + Math.sin(ang)*rad,size/2 - Math.cos(ang)*rad,7)){
            running = false;
            cnt = 60;
        }

        if (element.update(300)){delList.push(index)};
    }
    for (let index = 0; index < delList.length; index++) {
        const element = delList[index];
        obstacles.splice(element,1);
    }

}

function drawBackground(ctx, size){
    var grd = ctx.createRadialGradient(size/2, size/2, 5, size/2, size/2, size/2);
    grd.addColorStop(0,"#888888");
    grd.addColorStop(1,"black");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
}

function drawScore(ctx,size,score){
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText(score.toString(),size/2,size/8);
}

function drawScoregage(ctx,size,scoregage){
    ctx.fillStyle = "white";
    ctx.fillRect(size/2-scoregage,size-30,scoregage*2,5)
}

function drawSun(ctx,size){
    grd = ctx.createRadialGradient(size/2, size/2, 1, size/2, size/2, 20)
    grd.addColorStop(0.5,"#111111");
    grd.addColorStop(1,"#fcba03");
    ctx.fillStyle = grd
    ctx.beginPath();
    ctx.arc(size/2, size/2, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function drawEarth(ctx,size,ang,mag){
    ctx.fillStyle = "lightgreen";
    ctx.beginPath();
    ctx.arc(size/2 + Math.sin(ang)*mag,size/2 - Math.cos(ang)*mag,7,0,2*Math.PI);
    ctx.fill();
}

function drawObs(ctx){
    for (let index = 0; index < obstacles.length; index++) {
        const element = obstacles[index];
        ctx.fillStyle = element.color;
        ctx.beginPath();
        ctx.arc(element.pos[0],element.pos[1],element.size,0,2*Math.PI);
        ctx.fill();
    }
}

function drawStage(){
    ang += 0.051-0.00028*rad;
    if (ang > 2*Math.PI){
        ang -= 2*Math.PI
    }
    if (pressed) {rad += 0.7;}
    else{rad -= 0.7;}
    
    if (rad < 27){
        rad = 27;
        running = false;
        cnt = 60;
    }
    if (rad > 140){
        rad = 140;
        scoregage-=80/rad-0.1;
    }
        scoregage+=80/rad;
    if (scoregage > 100){
        score++;
        scoregage -= 100;
    }

    if(Math.random()*1000 < 6){
        obstacles.push(new obs(Math.random()*5+4,Math.random()*2*Math.PI,Math.random()+0.3,'skyblue'))
    }
    if(obtcnt<0){
        obstacles.push(new obs(Math.random()*6+7,Math.random()*2*Math.PI,Math.random()*0.5+0.2,'red'))
        obtcnt += 200;
    }
    obtcnt --;

    obsUpdate(300);

    drawBackground(ctx,300);
    drawEarth(ctx,300,ang,rad);
    drawObs(ctx);
    drawScore(ctx,300,score);
    drawScoregage(ctx,300,scoregage);
    drawSun(ctx,300);
}

function drawMenu(){
    drawBackground(ctx,300);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText("ORBIT!!",300/2,300/5);
    ctx.font = "15px Arial";
    ctx.fillText("score : "+score.toString(),300/2,500/5);
    ctx.fillText("highscore : "+highscore.toString(),300/2,600/5);
    ctx.fillText("Click again to start",300/2,200);
    cnt--;

}

function gameApp(){
    if (running){
        drawStage()
    }
    else{
        drawMenu()
    }
} 

var running = false;
chrome.storage.sync.get(['record'], function(result) {
  console.log('Value currently is ' + result.record);
    initialize(result.record);
});

setInterval(gameApp,16);

c.addEventListener("mousedown",()=>
{
    pressed = true;
    if (!running){
        if (cnt < 0){
            running = true;
            initialize(score);
        }
    }
})
c.addEventListener("mouseup",()=>
{
    pressed = false;
})

window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.key === " ") {
        pressed = true;
        if (!running){
            if (cnt < 0){
                running = true;
                initialize(score);
            }
        };
    }})


window.addEventListener("keyup", (event) => {
    if (event.isComposing || event.key === " ") {
    pressed = false;}
})

