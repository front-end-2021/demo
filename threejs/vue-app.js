// #region import
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
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
                TClock: { totalSec: 0, pauseSec: 0 },
            }
        },
        computed: {
            IdGenerator() { return new Snowflake(42n) },
            ViewTime() {
                const t_Clok = this.TClock
                let min = Math.floor(t_Clok.totalSec / 60)
                if (min < 10) min = `0${min}`
                let sec = t_Clok.totalSec % 60
                if (sec < 10) sec = `0${sec}`
                return [min, sec]
            },
        },
        // watch: { },
        methods: {},
        beforeCreate() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })
        },
        created() {

            const stats = new Stats();
            const renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            //renderer.toneMapping = THREE.ACESFilmicToneMapping;
            document.body.appendChild(renderer.domElement);
            document.body.appendChild(stats.dom);

            // Khởi tạo renderer, scene và camera isometric
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xa0d8ef);

            const aspect = window.innerWidth / window.innerHeight;
            const d = 90;
            // #region Camera (Isometric - Orthographic)
            const camera = new THREE.OrthographicCamera(
                -d * aspect, d * aspect,
                d, -d,
                0.1, 1000
            );
            camera.layers.enable(1); // bật layer 1 để camera nhìn thấy mesh
            // Góc nhìn isometric
            let camAsix = d
            const offset = new THREE.Vector3(camAsix, camAsix, camAsix);
            camera.position.set(offset.x, offset.y, offset.z);
            camera.lookAt(0, 0, 0);
            // #endregion

            // new RGBELoader()
            //     .load('textures/sky1k.hdr', function (texture, textureData) {
            //         texture.mapping = THREE.EquirectangularReflectionMapping;
            //         scene.background = texture
            //         scene.environment = texture
            //     })


            const clock = new THREE.Clock(false);
            const t_Clok = this.TClock
            t_Clok.pauseSec = 0
            t_Clok.totalSec = 0
            t_Clok.clock = clock
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
            let gridSize = 5
            const blockedTiles = new Set(['x_z', '1_1', '2_0'])
            function getTitleInGrid(posX) { return Math.round(posX / tileSize) + gridSize }
            function getPosFromGrid(tileX) { return (tileX - gridSize) * tileSize }
            let playerColor = 0x99ccff
            let blockColor = 'black'
            let group = new THREE.Group();
            // Tạo nền bằng các ô lưới
            let tileGrid = []
            group.name = 'Group_Ground'
            for (let x = -gridSize; x <= gridSize; x++) {
                let row = []
                for (let z = -gridSize; z <= gridSize; z++) {
                    let color, name
                    if (blockedTiles.has(`${x}_${z}`)) {
                        color = blockColor
                        name = 'Ground_Block'
                    } else {
                        color = getRandomColor()
                        name = 'Ground'
                    }
                    if (blockedTiles.has(`${z}_${x}`)) {
                        row.push(1)
                    } else {
                        row.push(0)
                    }
                    const tile = new THREE.Mesh(
                        new THREE.BoxGeometry(tileSize, 1, tileSize),
                        new THREE.MeshBasicMaterial({ color })
                    )
                    if (blockedTiles.has(`${x}_${z}`)) {
                        tile.layers.set(1); // gán mesh vào layer 1 (blocked)
                    }
                    tile.name = name
                    tile.position.set(x * tileSize, 0, z * tileSize);
                    group.add(tile);
                }
                tileGrid.push(row)
            }
            scene.add(group);
            let playerW = tileSize / 2
            let wayPoints = [new THREE.Vector3(0, playerW, 0)]
            // Tạo nhân vật đơn giản
            const player = new THREE.Mesh(
                new THREE.BoxGeometry(playerW, playerW * 2, playerW),
                new THREE.MeshBasicMaterial({ color: playerColor })
            );
            player.name = 'Player'
            player.position.set(wayPoints[0].x, wayPoints[0].y, wayPoints[0].z);
            wayPoints = []
            scene.add(player);

            const raycaster = new THREE.Raycaster();
            raycaster.layers.enable(0); // chỉ raycast với layer 0
            const mouse = new THREE.Vector2();

            window.addEventListener('mouseup', (event) => {
                if (!clock.running) return;
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
                    const hitMesh = hit.object
                    console.log("Click vào mesh:", hitMesh);
                    console.log("Tọa độ va chạm:", point); // Vector3(x, y, z)

                    if (2 === event.button) { // 2 là chuột phải
                        const targetPosition = point.clone();
                        targetPosition.y = player.position.y
                        if (hitMesh.name != 'Player') {
                            if (!wayPoints.length) {
                                wayPoints = buildWayPoints(player.position, targetPosition)
                            } else if (!isEqualPos(wayPoints[0], point)) {
                                if (!isEqualPos(wayPoints[0], targetPosition)) {
                                    wayPoints = buildWayPoints(player.position, targetPosition)
                                }
                            }
                        }

                    }
                }
            });
            function buildWayPoints(srcPos, desPos) {
                let des = { x: getTitleInGrid(srcPos.x), y: getTitleInGrid(srcPos.z) }
                let src = { x: getTitleInGrid(desPos.x), y: getTitleInGrid(desPos.z) }
                let paths = aStar(tileGrid, src, des)
                if (1 < paths.length) paths.pop()
                //  console.log(paths, src, des)
                return paths.map(ps => new THREE.Vector3(getPosFromGrid(ps.x), srcPos.y, getPosFromGrid(ps.y)))
            }
            document.addEventListener("keyup", (event) => {
                switch (event.key) {
                    case "p":
                        t_Clok.pauseSec = t_Clok.totalSec
                        clock.stop()
                        break;
                    case "r": clock.start()
                        break;
                }
            });
            const moveSpeed = 0.69
            document.addEventListener("keydown", (event) => {
                switch (event.key) {
                    case "ArrowUp": goInSometric(player, 'up', moveSpeed)
                        break;
                    case "ArrowDown": goInSometric(player, 'down', moveSpeed)
                        break;
                    case "ArrowLeft": goInSometric(player, 'left', moveSpeed)
                        break;
                    case "ArrowRight": goInSometric(player, 'right', moveSpeed)
                        break;
                }
            });
            const updateHUD = () => {
                const elapsed = Math.floor(clock.getElapsedTime());
                if (t_Clok.totalSec != t_Clok.pauseSec + elapsed) {
                    t_Clok.totalSec = t_Clok.pauseSec + elapsed
                }
            }
            function animFrame() {
                requestAnimationFrame(animFrame);
                if (clock.running) {
                    updateHUD(); // cập nhật HUD
                    goTo(player, moveSpeed)
                    updateIsometricCamera(camera, player); // camera bám theo nhân vật
                }
                renderer.render(scene, camera);
                stats.update(); // cập nhật FPS
            }
            animFrame();
            clock.start()
            function goInSometric(player, direct, step) {
                switch (direct) {
                    case 'up': player.position.z -= moveSpeed;
                        // player.position.x -= step; player.position.z -= step
                        return;
                    case 'right': player.position.x += moveSpeed;
                        // player.position.z -= step / 3; player.position.x += step / 3
                        return
                    case 'down': player.position.z += moveSpeed;
                        // player.position.z += step; player.position.x += step
                        return
                    case 'left': player.position.x -= moveSpeed;
                        // player.position.x -= step / 3; player.position.z += step / 3
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
            function goTo(player, speed) {
                if (wayPoints.length < 1) return;
                for (let ii = wayPoints.length - 1; -1 < ii; ii--) {
                    let targetPos3 = wayPoints[ii]
                    if (0 < targetPos3.distanceToSquared(player.position)) {
                        const direction = targetPos3.clone().sub(player.position).normalize(); // Tính hướng đi từ vị trí hiện tại đến đích
                        player.position.add(direction.multiplyScalar(speed)); // Di chuyển theo hướng đó với tốc độ nhất định
                        if (player.position.distanceToSquared(targetPos3) < speed * speed) {
                            player.position.copy(targetPos3);   // Dừng lại nếu đã đến gần đích
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
    const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan

    let paths = getPaths([start], 't', new Map())
    let pathsB = getPaths([start], 'b', new Map())
    if (pathsB.length) {
        if (!paths.length) paths = pathsB
        else if (pathsB.length < paths.length) paths = pathsB
    }
    pathsB = getPaths([start], 'r', new Map())
    if (pathsB.length) {
        if (!paths.length) paths = pathsB
        else if (pathsB.length < paths.length) paths = pathsB
    }
    pathsB = getPaths([start], 'l', new Map())
    if (pathsB.length) {
        if (!paths.length) paths = pathsB
        else if (pathsB.length < paths.length) paths = pathsB
    }
    return paths
    function getPaths(openPoints, tblr, cameFrom) {
        const gScore = new Map([[getKey(start.x, start.y), 0]]);
        const fScore = new Map([[getKey(start.x, start.y), heuristic(start, goal)]]);
        let current
        while (0 < openPoints.length) {
            current = openPoints.reduce((a, b) => fScore.get(getKey(a.x, a.y)) < fScore.get(getKey(b.x, b.y)) ? a : b)
            if (current.x === goal.x && current.y === goal.y) return reconstructPath(cameFrom, current)

            openPoints = openPoints.filter(p => getKey(p.x, p.y) !== getKey(current.x, current.y))
            let openKey = new Set(openPoints.map(p => getKey(p.x, p.y)))
            const neighbors = getNeighbors([current.x, current.y], grid, tblr);
            let tentativeG, neighborKey
            for (const neighbor of neighbors) {
                tentativeG = gScore.get(getKey(current.x, current.y)) + 1;
                neighborKey = getKey(neighbor.x, neighbor.y);
                if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
                    cameFrom.set(neighborKey, current);
                    gScore.set(neighborKey, tentativeG);
                    fScore.set(neighborKey, tentativeG + heuristic(neighbor, goal));
                    if (!openKey.has(neighborKey)) openPoints.push(neighbor)
                }
            }
        }
        return [] // không tìm thấy đường
    }
    function getKey(x, y) { return `${x},${y}` }
    function getNeighbors(pos, grid, tblr) {
        let directions = [[0, -1], [0, 1], [-1, 0], [1, 0]]
        switch (tblr) {
            case 't': directions = [[0, -1], [1, 0], [0, 1], [-1, 0]] // top-right-bot-left
                break;
            case 'b': directions = [[0, 1], [-1, 0], [0, -1], [1, 0]] // bot-left-top-right
                break;
            case 'l': directions = [[-1, 0], [0, -1], [1, 0], [0, 1]] // left-top-right-bot
                break;
            case 'r': directions = [[1, 0], [0, 1], [-1, 0], [0, -1]] // right-bot-left-top
                break;
        }
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
