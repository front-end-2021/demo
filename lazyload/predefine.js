//loadHTML('#grp-templates', `/demo/template.html`)

function loadHTML(selector, path) {
    fetch(path).then(response => response.text())
        .then(text => document.querySelector(selector).innerHTML = text);
}