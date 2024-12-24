// #region import
import { createApp } from 'vue'
import { PageMegaMart } from './pages/mega-mart.js'
// #endregion
Promise.all([
    includeHTML(`./pages/mega-mart.html`),
]).then((values) => {
    const app = createApp({
        name: `app-main`,
        components: {
            'page-megamart': PageMegaMart,
        },
        data() {
            return {
                IndexPage: 0,
                Categories: getCategories(),
                SelecteCates: ['Groceries']
            }
        },
        computed: {
            CompPage() {
                switch (this.IndexPage) {
                    case 0: return 'page-megamart';
                    default: break;
                }
            },
        },
        // watch: {
        //     IndexPage(val) {  },
        // },
        methods: {
            selectPage(index) { this.IndexPage = index },
        },
        //  beforeCreate() { },
        created() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })

        },
        mounted() {

            const message = "123456";
            const hash = CryptoJS.SHA256(message);
            console.log('test sha256', hash.toString(CryptoJS.enc.Hex));

            document.addEventListener('mousemove', this.trackMouse)
            document.addEventListener("keyup", this.onKeyUp);
        }
    })
    app.mount('#m-app')

}).catch(errStatus => { console.log('Woop!', errStatus) })
function getCategories() {
    const lst = [
        'Groceries', 'Premium Fruits', 'Home & Kitchen', 'Fashion', 'Electronics',
        'Beauty', 'Home Improvement', 'Sport, Toys & Luggage'
    ]
    return lst
}
function includeHTML(path) {
    const items = document.body.getElementsByClassName("dnb-imp-html");
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