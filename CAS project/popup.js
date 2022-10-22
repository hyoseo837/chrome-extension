stage = document.getElementById('test')
var i=0;
function gameApp(){
    stage.innerHTML = i
    i++;
    return 0;
}

setInterval(gameApp, 100); // 60 frame per second