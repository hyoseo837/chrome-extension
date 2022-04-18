var letters = [];
letters.push(document.getElementById('char1'))
letters.push(document.getElementById('char2'))
letters.push(document.getElementById('char3'))
letters.push(document.getElementById('char4'))
letters.push(document.getElementById('char5'))

for (let index = 0; index < letters.length; index++) {
    const element = letters[index];
    element.innerHTML = 'L'
    console.log(element)
    
}