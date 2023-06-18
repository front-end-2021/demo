loadHTML('#grp-templates', `https://github.com/front-end-2021/demo/blob/main/lazyload/template.html`)

function loadHTML(selector, path) {
    fetch(path).then(response => response.text())
        .then(text => document.querySelector(selector).innerHTML = text);
}