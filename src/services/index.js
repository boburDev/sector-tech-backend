const json = require('./brands.json')

function getFirstCharCode(str) {
    return str.charCodeAt(0);
}

for (const i of json) {
    console.log(getFirstCharCode(i.title))
}