var reset_button = document.getElementById("reset");
reset_button.addEventListener("click",resetStorage);

function resetStorage(){
    alert("The extension was reseted");
    chrome.storage.sync.set({tuto_skip: false}, function() {
        console.log('Value is set to ' + false);
    });
}