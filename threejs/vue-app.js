// #region import
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Snowflake, convertDic, insertHTMLAtCursor } from './common.js'
import { createApp } from 'vue'
//import {  } from './components/forms.js'
// #endregion
Promise.all([
    includeHTML(`./components/forms.html`),
]).then((values) => {
    createApp({
        name: `app-main`,
        components: {
            // 'view-commands': ViewCommands,
        },
        data() {

            return {


            }
        },
        computed: {
            IdGenerator() { return new Snowflake(42n) },
        },
        // watch: {
        //     'Search.Name'(txt) { console.log('watch search name ', txt) },
        // },
        methods: {

        },
        beforeCreate() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })
        },
        created() {
            // Khởi tạo renderer, scene và camera isometric
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            // Góc nhìn isometric
            camera.position.set(100, 100, 100);
            camera.lookAt(0, 0, 0);
            
            const gridW = 20
            let groundColor = 0x99ccff
            // Tạo nền bằng các ô lưới
            for (let x = -5; x <= 5; x++) {
                for (let z = -5; z <= 5; z++) {
                    const tile = new THREE.Mesh(
                        new THREE.BoxGeometry(gridW, 1, gridW),
                        new THREE.MeshBasicMaterial({ color: groundColor })
                    );
                    tile.position.set(x * gridW, 0, z * gridW);
                    scene.add(tile);
                }
            }
            let playerColor = 'green'
            // Tạo nhân vật đơn giản
            const player = new THREE.Mesh(
                new THREE.BoxGeometry(gridW / 2, gridW, gridW / 2),
                new THREE.MeshBasicMaterial({ color: playerColor })
            );
            player.position.set(0, 10, 0);
            scene.add(player);

            const step = 5
            document.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowUp":
                        player.position.z -= step;
                        break;
                    case "ArrowDown":
                        player.position.z += step;
                        break;
                    case "ArrowLeft":
                        player.position.x -= step;
                        break;
                    case "ArrowRight":
                        player.position.x += step;
                        break;
                }
            });
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        },
        //beforeMount() { },
        mounted() {

            // const message = "123456";
            // const hash = CryptoJS.SHA256(message);//CryptoJS.MD5(message);
            // console.log(hash.toString(CryptoJS.enc.Hex));
            // console.log(hash.toString(CryptoJS.enc.Base64));// speed > Hex

        },
        //  beforeUpdate() { },
        //  updated() { },
    }).mount('#vue-app')

}).catch(errStatus => { console.log('Woop!', errStatus) })

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