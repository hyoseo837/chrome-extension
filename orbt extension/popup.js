var ang =0;
var rad = 100;
var score = 0;
var scoregage = 0;
var highscore = 0;
var pressed = false;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function initialize(high){
    ang =0;
    rad = 100;
    score = 0;
    scoregage = 0;
    if (high > highscore){
        highscore = high;
    }
    pressed = false;
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
    ctx.fillstyle = "white";
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

function drawEarth(ctx,rad,size,ang,mag){
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(size/2 + Math.sin(ang)*mag,size/2 - Math.cos(ang)*mag,rad,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

function drawStage(){
    ang += 0.051-0.00028*rad;
    if (ang > 2*Math.PI){
        ang -= 2*Math.PI
    }
    if (rad>25 && rad<150){
    if (pressed) {rad += 0.7;}
    else{rad -= 0.7;}
    }
    else{
        rad = 149;
    }
    if (rad<27){
        running = false;
    }
    else{
        scoregage++;
    }
    if (scoregage > 100){
        score++;
        scoregage -= 100;
    }
    drawBackground(ctx,300);
    drawEarth(ctx,7,300,ang,rad);
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