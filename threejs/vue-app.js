// #region import
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js';  // debug 
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
            scene.background = new THREE.Color(0xa0d8ef);

            // #region Camera (Isometric - Orthographic)
            const aspect = window.innerWidth / window.innerHeight;
            const d = 90;
            const camera = new THREE.OrthographicCamera(
                -d * aspect, d * aspect,
                d, -d,
                0.1, 1000
            );
            // Góc nhìn isometric
            let camAsix = d
            const offset = new THREE.Vector3(camAsix, camAsix, camAsix);
            camera.position.set(offset.x, offset.y, offset.z);
            camera.lookAt(0, 0, 0);
            // #endregion
            const stats = new Stats();
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);
            document.body.appendChild(stats.dom);

            // Controls
            const controls = new OrbitControls(camera, renderer.domElement);
            // controls.enableRotate = false;
            controls.enableDamping = true;
            //controls.enablePan = true;
            controls.zoomSpeed = 1.2;

            // #region Thêm ánh sáng
            let light = new THREE.DirectionalLight(0xffffff, 0.8);
            light.position.set(10, 20, 10);
            scene.add(light);
            light = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(light);
            // #endregion

            const tileSize = 20

            const forbiddenTiles = new Set(['1_1', '2_0'])
            function getTitleInGrid(posX) { return Math.round(posX / tileSize) + 5 }
            function getPosFromGrid(tileX) { return (tileX - 5) * tileSize }
            let playerColor = 0x99ccff
            let blockColor = 'black'
            // Tạo nền bằng các ô lưới
            let tileGrid = []
            for (let x = -5; x <= 5; x++) {
                let row = []
                for (let z = -5; z <= 5; z++) {
                    let color, name
                    if (forbiddenTiles.has(`${x}_${z}`)) {
                        color = blockColor

                        name = 'Ground_Block'
                    } else {
                        color = getRandomColor()
                        name = 'Ground'
                    }
                    if (forbiddenTiles.has(`${z}_${x}`)) {
                        row.push(1)
                    } else {
                        row.push(0)
                    }
                    const tile = new THREE.Mesh(
                        new THREE.BoxGeometry(tileSize, 1, tileSize),
                        new THREE.MeshBasicMaterial({ color })
                    )
                    tile.name = name
                    tile.position.set(x * tileSize, 0, z * tileSize);
                    scene.add(tile);
                }
                tileGrid.push(row)
            }
            let playerW = tileSize / 2
            let wayPoints = [new THREE.Vector3(0, playerW, 0)]
            // Tạo nhân vật đơn giản
            const player = new THREE.Mesh(
                new THREE.BoxGeometry(playerW, playerW * 2, playerW),
                new THREE.MeshBasicMaterial({ color: playerColor })
            );
            player.name = 'Player'
            player.position.set(wayPoints[0].x, wayPoints[0].y, wayPoints[0].z);
            scene.add(player);

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            window.addEventListener('mouseup', (event) => {
                // Chuyển đổi tọa độ chuột sang không gian Normalized Device Coordinates (-1 đến 1)
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                // Gán ray từ camera và tọa độ chuột
                raycaster.setFromCamera(mouse, camera);

                // Kiểm tra va chạm với danh sách mesh (ví dụ: scene.children)
                const intersects = raycaster.intersectObjects(scene.children, true);

                if (intersects.length > 0) {
                    const hit = intersects[0]; // đối tượng bị va chạm đầu tiên

                    const point = hit.point; // tọa độ điểm va chạm trong không gian 3D
                    console.log("Click vào mesh:", hit.object);
                    console.log("Tọa độ va chạm:", point); // Vector3(x, y, z)

                    if (2 === event.button) { // 2 là chuột phải
                        const targetPosition = point.clone();
                        targetPosition.y = player.position.y
                        if (!wayPoints.length) {
                            wayPoints = [targetPosition]

                            let src = { x: getTitleInGrid(player.position.x), y: getTitleInGrid(player.position.z) }
                            let des = { x: getTitleInGrid(targetPosition.x), y: getTitleInGrid(targetPosition.z) }
                            let paths = aStar(tileGrid, src, des)
                            wayPoints = paths.map(ps => new THREE.Vector3(getPosFromGrid(ps.x), player.position.y, getPosFromGrid(ps.y)))
                            wayPoints.reverse()
                            console.log(paths, tileGrid, src, des, wayPoints)
                        }
                        else if (!isEqualPos(wayPoints[0], point) && hit.object.name != 'Player') {
                            if (!isEqualPos(wayPoints[0], targetPosition)) {
                                wayPoints = [targetPosition]

                                let src = { x: getTitleInGrid(player.position.x), y: getTitleInGrid(player.position.z) }
                                let des = { x: getTitleInGrid(targetPosition.x), y: getTitleInGrid(targetPosition.z) }
                                let paths = aStar(tileGrid, src, des)
                                wayPoints = paths.map(ps => new THREE.Vector3(getPosFromGrid(ps.x), player.position.y, getPosFromGrid(ps.y)))
                                wayPoints.reverse()
                                console.log(paths, tileGrid, src, des, wayPoints)
                            }
                        }
                    }
                }
            });

            const moveSpeed = 0.69
            document.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowUp": goInSometric(player, 'up', moveSpeed)
                        //player.position.z -= moveSpeed;
                        break;
                    case "ArrowDown": goInSometric(player, 'down', moveSpeed)
                        //player.position.z += moveSpeed;
                        break;
                    case "ArrowLeft": goInSometric(player, 'left', moveSpeed)
                        //player.position.x -= moveSpeed;
                        break;
                    case "ArrowRight": goInSometric(player, 'right', moveSpeed)
                        //player.position.x += moveSpeed;
                        break;
                }
            });
            const clock = new THREE.Clock();
            function animate() {
                requestAnimationFrame(animate);
                //  updateHUD(); // cập nhật HUD
                goTo(player, moveSpeed)
                updateIsometricCamera(camera, player); // camera bám theo nhân vật
                renderer.render(scene, camera);
                stats.update(); // cập nhật FPS
            }
            animate();
            function goInSometric(player, direct, step) {
                switch (direct) {
                    case 'up':
                        player.position.x -= step
                        player.position.z -= step
                        return;
                    case 'right':
                        player.position.z -= step / 3
                        player.position.x += step / 3
                        return
                    case 'down':
                        player.position.z += step
                        player.position.x += step
                        return
                    case 'left':
                        player.position.x -= step / 3
                        player.position.z += step / 3
                        return;
                    case 'up-right': player.position.z -= step;
                        return;
                    case 'up-left': player.position.x -= step;
                        return;
                    case 'down-right': player.position.x += step;
                        return;
                    case 'down-left': player.position.z += step;
                        return;
                    default: break;
                }
            }
            function updateHUD() {
                const elapsed = Math.floor(clock.getElapsedTime());
                console.log(`Thời gian: ${elapsed}s`)
            }
            function goTo(player, speed) {
                if (wayPoints.length < 1) return;
                for (let ii = wayPoints.length - 1; -1 < ii; ii--) {
                    let targetPos3 = wayPoints[ii]
                    if (0 < targetPos3.distanceToSquared(player.position)) {
                        // Tính hướng đi từ vị trí hiện tại đến đích
                        const direction = targetPos3.clone().sub(player.position).normalize();

                        // Di chuyển theo hướng đó với tốc độ nhất định
                        player.position.add(direction.multiplyScalar(speed));

                        // Dừng lại nếu đã đến gần đích
                        if (player.position.distanceToSquared(targetPos3) < speed * speed) {
                            player.position.copy(targetPos3);
                            wayPoints.splice(ii, 1)
                        }
                        break
                    }
                }
            }
            function isEqualPos(vec3a, vec3b) {
                if (vec3a.x == vec3b.x && vec3a.y == vec3b.y && vec3a.z == vec3b.z) return true
                return false
            }
            function updateIsometricCamera(camera, player) {
                const targetPosition = player.position.clone();
                const cameraPosition = targetPosition.clone().add(offset);

                camera.position.lerp(cameraPosition, 0.1); // di chuyển mượt
                camera.lookAt(targetPosition);
            }
            function getRandomColor() {
                const r = Math.random();
                const g = Math.random();
                const b = Math.random();
                return new THREE.Color(r, g, b);
            }
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
function aStar(grid, start, goal) {
    let openSet = [start];
    const cameFrom = new Map();

    const gScore = new Map();
    const fScore = new Map();

    const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan

    gScore.set(getKey(start.x, start.y), 0);
    fScore.set(getKey(start.x, start.y), heuristic(start, goal));

    while (openSet.length > 0) {
        let current = openSet.reduce((a, b) => fScore.get(getKey(a.x, a.y)) < fScore.get(getKey(b.x, b.y)) ? a : b)

        if (current.x === goal.x && current.y === goal.y) return reconstructPath(cameFrom, current)

        openSet = openSet.filter(p => getKey(p.x, p.y) !== getKey(current.x, current.y))
        const neighbors = getNeighbors([current.x, current.y], grid);
        for (const neighbor of neighbors) {
            const tentativeG = gScore.get(getKey(current.x, current.y)) + 1;
            const neighborKey = getKey(neighbor.x, neighbor.y);

            if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeG);
                fScore.set(neighborKey, tentativeG + heuristic(neighbor, goal));

                if (!openSet.some(p => getKey(p.x, p.y) === neighborKey)) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    return []; // không tìm thấy đường
    function getKey(x, y) { return `${x},${y}` }
    function getNeighbors(pos, grid) {
        const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]
        const neighbors = []
        for (const d of directions) {
            const x = pos[0] + d[0];
            const y = pos[1] + d[1];
            if (grid[y] && grid[y][x] === 0) neighbors.push({ x, y })
        }
        return neighbors;
    }
    function reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom.has(getKey(current.x, current.y))) {
            current = cameFrom.get(getKey(current.x, current.y))
            path.unshift(current)
        }
        return path
    }
}
