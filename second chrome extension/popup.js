let but1 = document.getElementById("fun1");
let but2 = document.getElementById("fun2");
let but3 = document.getElementById("fun3");

function myfun1 () {
    console.log("1")
}
function myfun2 () {
    console.log("2")
}
function myfun3 () {
    console.log("3")
}

but1.addEventListener("click",myfun1)
but2.addEventListener("click",myfun2)
but3.addEventListener("click",myfun3)
console.log("why it's not working?")