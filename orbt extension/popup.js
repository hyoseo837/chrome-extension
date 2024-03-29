import {obs} from "./obstacle.js"
import {item} from "./item.js"

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
var items = [];
var delList = [];

function initialize(high){
    ang =0;
    rad = 100;
    score = 0;
    if (high > highscore){
        highscore = high;}
    scoregage = 0;
    pressed = false;
    delList = [];
    obstacles = [];
    items = [];
}
function gameEnd(high){
    if (high > highscore){
        highscore = high;
        chrome.storage.sync.set({record: high}, function() {
            console.log('Value is set to ' + high);
        });
    }
    running = 0;
    cnt = 60;
}

function obsUpdate(size){
    delList = [];
    for (let index = 0; index < obstacles.length; index++) {
        const element = obstacles[index];

        if (element.checkHit(size/2 + Math.sin(ang)*rad,size/2 - Math.cos(ang)*rad,7)){
            gameEnd(score)
        }

        if (element.update(300)){delList.push(index)};
    }
    for (let index = 0; index < delList.length; index++) {
        const element = delList[index];
        obstacles.splice(element,1);
    }
}

function itemUpdate(size){
    delList = [];
    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (element.checkHit(size/2 + Math.sin(ang)*rad,size/2 - Math.cos(ang)*rad,7)){
            // item effect
            if (element.type == "+3"){
                score += 3
            }
            delList.push(index)
        }
        if (element.update(300)){delList.push(index)};
    }
    for (let index = 0; index < delList.length; index++) {
        const element = delList[index];
        items.splice(element,1);
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
    ctx.fillRect(size/2-scoregage,size-20,scoregage*2,5)
}

function drawSun(ctx,size){
    grd = ctx.createRadialGradient(size/2, size/2, 1, size/2, size/2, 20)
    grd.addColorStop(0.5,"#111111");
    grd.addColorStop(1,"#bf40bf");
    ctx.fillStyle = grd
    ctx.strokeStyle = "black"
    ctx.setLineDash([]);
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
function drawPath(ctx,size,mag){
    ctx.beginPath();
    ctx.setLineDash([1, 5]);
    ctx.arc(size/2, size/2, mag, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle="gray";
    ctx.stroke();
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

function drawItem(ctx){
    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        // ctx.drawImage(element.img, element.pos[0]-14, element.pos[1]-14);
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
        gameEnd(score)
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
        obstacles.push(new obs(Math.random()*3+6,Math.random()*2*Math.PI,Math.random()+0.3,'red'))
    }
    if(Math.random()*1000 < 2){
        items.push(new item("+3",Math.random()*Math.PI*2,document.getElementById("item_icon")))
    }

    if(obtcnt<0){
        obstacles.push(new obs(Math.random()*4+7,Math.random()*2*Math.PI,Math.random()*0.5+0.2,'red'))
        obtcnt += 200;
    }
    obtcnt --;

    obsUpdate(300);
    itemUpdate(300);

    drawBackground(ctx,300);
    // drawPath(ctx,300,rad);
    drawEarth(ctx,300,ang,rad);
    drawObs(ctx);
    drawItem(ctx);
    drawScore(ctx,300,score);
    drawScoregage(ctx,300,scoregage);
    drawSun(ctx,300);
}

function drawMenu(){
    drawBackground(ctx,300);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("ORBIT!!",300/2,300/5);
    ctx.font = "15px Arial";
    ctx.fillText("score : "+score.toString(),300/2,500/5);
    ctx.fillText("highscore : "+highscore.toString(),300/2,600/5);
    ctx.fillText("Click again to start",300/2,200);
    cnt--;
}


function drawTutorial(){
    drawBackground(ctx,300);
    drawSun(ctx,300);
    drawScoregage(ctx,300,100);
    drawPath(ctx,300,100);
    drawEarth(ctx,300,6,100);
    
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(270,200,8,0,2*Math.PI);
    ctx.fill();
    
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(20,250,7,0,2*Math.PI);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "left"
    ctx.fillText("Press 'Q' to remove tutorial",0,10);
    ctx.fillText("Hold mouse or 'space' to go up",72,76);
    ctx.fillText("This gives +3 points",34,250);
    ctx.fillText("Don't crash with the Sun and Planets",96,185);
    ctx.fillText("This is you",136,57);
    ctx.fillText("Lower orbit -> more score",150,297);
    cnt--;

}

function gameApp(){
    if (running==2){
        drawStage()
    }
    else if(running == 0){
        drawMenu()
    }
    else{
        if(tutorial_skip){
            running =2;
        }
        else{drawTutorial()}
    }
} 

var running = 0;
chrome.storage.sync.get(['record'], function(result) {
    console.log('Value currently is ' + result.record);
    initialize(result.record);
});
var tutorial_skip = false;
chrome.storage.sync.get(['tuto_skip'], function(result) {
    console.log('Value currently is ' + result.record);
    tutorial_skip = result.tuto_skip;
});


setInterval(gameApp,16);

c.addEventListener("mousedown",()=>
{
    pressed = true;
    if (running != 2){
        if (cnt < 0){
            running +=1;
            cnt = 30;
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
        if (running!=2){
            if (cnt < 0){
                running += 1;
                cnt = 30;
                initialize(score);
            }
        };
    }
    if (event.isComposing || event.key === "q") {
        if (running!=2){
            running = 0;
            tutorial_skip = true;
            chrome.storage.sync.set({tuto_skip: true}, function() {
                console.log('Value is set to ' + true);
            });
        };
}})
window.addEventListener("keyup", (event) => {
    if (event.isComposing || event.key === " ") {
    pressed = false;}
})
