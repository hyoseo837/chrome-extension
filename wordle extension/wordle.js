
var possible_guesses;
function readTextFile(file)
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
                possible_guesses = allText.split("\r\n")
            }
        }
    }
    rawFile.send(null);
}
readTextFile("possible_words.txt");

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
    if(curser>0){letters[curser-1].innerHTML = "-"
    curser--;}
})

var submit = document.getElementById("submit")
submit.addEventListener("click", ()=>{
    if (curser==5){
        answer = letters[0].innerHTML + letters[1].innerHTML + letters[2].innerHTML + letters[3].innerHTML + letters[4].innerHTML;
        if (possible_guesses.includes(answer)){
            alert("something")
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