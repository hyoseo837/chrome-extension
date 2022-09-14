import {obs} from "./obstacle.js"


var ang =0;
var rad = 100;
var score = 0;
var scoregage = 0;
var highscore = 0;
var pressed = false;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var grd = ctx.createRadialGradient(0,0,0,0,0,0);

var obstacles = [new obs(5,Math.PI,0.5,"red"),new obs(5,Math.PI*0.2,0.3,"purple")];
var delList = [];

function initialize(high){
    ang =0;
    rad = 100;
    score = 0;
    scoregage = 0;
    pressed = false;
    delList = [];
    obstacles = [new obs(5,Math.PI,1.3,"red"),new obs(5,Math.PI*0.2,0.9,"purple"),new obs(8,Math.PI*1.3,0.3,"skyblue")];
    if (high > highscore){
        highscore = high;
    }
}

function obsUpdate(size){
    delList = [];
    for (let index = 0; index < obstacles.length; index++) {
        const element = obstacles[index];

        if (element.checkHit(size/2 + Math.sin(ang)*rad,size/2 - Math.cos(ang)*rad,7)){
            running = false;
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
    grd.addColorStop(1,"#BF40BF");
    ctx.fillStyle = grd
    ctx.beginPath();
    ctx.arc(size/2, size/2, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function drawEarth(ctx,size,ang,mag){
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(size/2 + Math.sin(ang)*mag,size/2 - Math.cos(ang)*mag,7,0,2*Math.PI);
    ctx.fill();
}

function drawObs(ctx){
    for (let index = 0; index < obstacles.length; index++) {
        const element = obstacles[index];
        console.log(element.pos)
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
    ctx.fillText("Click again to restart",300/2,200);

}

function gameApp(){
    if (running){
        drawStage()
    }
    else{
        drawMenu()
    }
} 

var running = true;
initialize(0);
setInterval(gameApp,16);

c.addEventListener("mousedown",()=>
{
    pressed = true;
    if (!running){
        running = true;
        initialize(score);
    }
})
c.addEventListener("mouseup",()=>
{
    pressed = false;
})
