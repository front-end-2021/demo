loadHTML('#grp-templates', `template.html`)

function loadHTML(selector, path) {
    fetch(path).then(response => response.text())
        .then(text => document.querySelector(selector).innerHTML = text);
}