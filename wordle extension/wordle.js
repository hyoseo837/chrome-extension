var possible_guesses
var possible_answers 
const colors = ["#3a3a3c", "#b59f3b", "#538d4e"]

var today = parseInt(Date.now() / (1000*60*60*24))

function readTextFile(file,id)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                if (id == 1){
                    possible_answers = allText.split("\r\n");
                }
                else if(id == 2){
                    possible_guesses = allText.split("\r\n");
                }
            }
        }
    }
    rawFile.send(null);
}

function checkAnswer(tgt,ans){
    var result = [0,0,0,0,0];
    for(let i = 0; i<5; i++){
        if (tgt[i] == ans[i]){
            result[i] = 2;
            continue
        }
        for(let j=0;j<5;j++){
            if (ans[j] == tgt[i] && result[j] == 0){
                result[j] = 1;
                break
            }
        }
    }
    return result
}



readTextFile("wordle-answers-shuffled.txt",1);
readTextFile("possible_words.txt",2);

var target = possible_answers[today % possible_answers.length]
var words = [];
words.push(document.getElementById('word_1'));
words.push(document.getElementById('word_2'));
words.push(document.getElementById('word_3'));
words.push(document.getElementById('word_4'));
words.push(document.getElementById('word_5'));

var trial = 0;
var letters = [
    words[0].children[0],
    words[0].children[1],
    words[0].children[2],
    words[0].children[3],
    words[0].children[4]];
// console.log(words[0].children)

var curser = 0;

var keyboard = document.getElementById("keyboard").children
for (let index = 0; index < keyboard.length; index++) {
    const element = keyboard[index];
    element.addEventListener("click",()=> {
    if (curser<5){
    letters[curser].innerHTML = String.fromCharCode(65 + index);
    curser++;}
})}

var backspace = document.getElementById("backspace")
backspace.addEventListener("click", ()=>{
    if(curser>0){letters[curser-1].innerHTML = "_"
    curser--;}
})

var submit = document.getElementById("submit")
submit.addEventListener("click", ()=>{
    if (curser==5){
        answer = letters[0].innerHTML + letters[1].innerHTML + letters[2].innerHTML 
        + letters[3].innerHTML + letters[4].innerHTML;
        if (possible_guesses.includes(answer.toLowerCase()) || 
        possible_answers.includes(answer.toLowerCase())){
            var results = checkAnswer(target.toUpperCase(),answer);
            if (results == [2,2,2,2,2]){
                alert("you got it!!!");
            }
            for (let index = 0; index < 5; index++) {
                letters[index].style.backgroundColor = colors[results[index]]
            }
            if (results == [2,2,2,2,2]){
                alert("you got it!!!")
            }
            trial ++;
            curser = 0;
            letters = [
                words[trial].children[0],
                words[trial].children[1],
                words[trial].children[2],
                words[trial].children[3],
                words[trial].children[4]];
        }
    }
})