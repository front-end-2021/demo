import WpyMain from './main.js'
import { getUsers, getTasks, regions } from './repo.js'
import { createApp } from 'vue'
import VueObserveVisibility from 'vue3-observe-visibility'
Promise.all([
    includeHTML(`./main.html`),
]).then((values) => {
    const app = createApp({
        name: `App.Main`,
        components: {
            'wpy-main': WpyMain,
        },
        data() {
            const users = getUsers()
            const user = Object.assign({
                Pwlog: ''
            }, users[0])
            return {
                LsRegion: regions,
                LsUser: users,
                LsTask: getTasks(),
                Account: user,
            }
        },
        methods: {

        },
        computed: {
            UserStatus() {
                const user = this.Account
                let hash = CryptoJS.SHA256(user.Pwlog);
                hash = hash.toString(CryptoJS.enc.Hex)
                if (hash == user.Password) return 1
                return 0
            },
        },
        mounted() {
            values.forEach((path, ii) => { // console.log(path, ii)
                let pDom = document.body.querySelector(`.dnbimporthtml[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })

            const message = "123456";
            const hash = CryptoJS.SHA256(message);
            console.log('test sha256', hash.toString(CryptoJS.enc.Hex));

        },

    })
    app.directive('observe-visibility', VueObserveVisibility.ObserveVisibility)
    app.mount('#app')
})
function includeHTML(path) {
    const items = document.body.getElementsByClassName("dnbimporthtml");
    path = path.trim()
    for (let i = 0; i < items.length; i++) {
        const elmnt = items[i];   /*search for elements with a certain atrribute:*/
        const file = elmnt.getAttribute("dnbpath");
        if (!file) continue
        if (file.trim() !== path) continue

        const xhr = new XMLHttpRequest(); /* Make an HTTP request using the attribute value as the file name: */
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 0 || (200 <= xhr.status && xhr.status < 400)) {
                        // The request has been completed successfully
                        document.body.innerHTML += `\n ${xhr.responseText}`
                        resolve(path, xhr.responseText)
                    } else {
                        reject(xhr.status) // There has been an error with the request!
                    }
                    elmnt.removeAttribute("dnbpath"); /* Remove the attribute, and call xhr function once more: */
                }
            }
            xhr.open("GET", file, true);
            xhr.send();
        })
    }
}