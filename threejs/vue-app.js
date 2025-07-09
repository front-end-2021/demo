// #region import
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
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
        methods: {
            pauseGame(type) {
                const t_Clok = this.TClock
                switch (type) {
                    case 'pause': t_Clok.pauseSec = t_Clok.totalSec
                        t_Clok.clock.stop()
                        break;
                    case 'resume': t_Clok.clock.start()
                        break;
                }
            },
        },
        beforeCreate() {
            values.forEach((path, ii) => {
                let pDom = document.body.querySelector(`.dnb-imp-html[dnbpath="${path}"]`)
                if (pDom) pDom.remove();
            })
        },
        created() {
            let camera, scene, stats, clock, container, controls, renderer,
                mixer, actions, activeAction,
                offset, playerColor, model, gui, face, player
            let tileGrid = []
            let moveSpeed = 0.69
            const pathModel = `models/RobotExpressive.glb`
            const api = { state: 'Walking' };
            let lsReactive = []
            let gridSize = 5,
                tileSize = 20,
                blockedTiles = new Set(['x_z', '1_1', '2_0'])
            let wayPoints = [new THREE.Vector3(0, 0, 0)]
            let gridPoints = []     // `x_y_z`
            let setCharacter = new Set()
            let setName = new Set(['Player', 'Group_Ground', 'Character'])
            const t_Clok = this.TClock
            {
                // #region Camera (Isometric - Orthographic)
                const aspect = window.innerWidth / window.innerHeight;
                const d = 90;
                camera = new THREE.OrthographicCamera(
                    -d * aspect, d * aspect,
                    d, -d,
                    0.1, 1000
                );
                camera.layers.enable(1); // bật layer 1 để camera nhìn thấy mesh
                // Góc nhìn isometric
                let camAsix = d
                offset = new THREE.Vector3(camAsix, camAsix, camAsix);
                camera.position.set(offset.x, offset.y, offset.z);
                camera.lookAt(0, 0, 0);
                // #endregion
                // #region Tạo scene
                scene = new THREE.Scene();
                scene.background = new THREE.Color(0xe0e0e0);
                //  scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);
                // #endregion
                // #region Tạo Clock
                clock = new THREE.Clock(false);
                t_Clok.pauseSec = 0
                t_Clok.totalSec = 0
                t_Clok.clock = clock
                // #endregion
                stats = new Stats();
                // #region Thêm ánh sáng
                let light = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
                light.position.set(0, 20, 0);
                scene.add(light);
                light = new THREE.DirectionalLight(0xffffff, 3);
                light.position.set(0, 20, 10);
                scene.add(light);
                // #endregion
                // #region Thêm ground
                playerColor = 0x99ccff
                let blockColor = 'black'
                let group = new THREE.Group();
                group.name = 'Group_Ground'
                // Tạo nền bằng các ô lưới
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
                        if (blockedTiles.has(`${z}_${x}`)) { row.push(1) }
                        else { row.push(0) }
                        const tile = new THREE.Mesh(
                            new THREE.BoxGeometry(tileSize, 1, tileSize),
                            new THREE.MeshBasicMaterial({ color })
                        )
                        tile.name = name
                        let posX = x * tileSize
                        let posY = 0
                        let posZ = z * tileSize
                        tile.position.set(posX, posY, posZ);
                        gridPoints.push(buildGridPoint(posX, posY, posZ))
                        if (blockedTiles.has(`${x}_${z}`)) tile.layers.set(1); // gán mesh vào layer 1 (blocked)
                        else lsReactive.push(tile)
                        group.add(tile);
                    }
                    tileGrid.push(row)
                }
                scene.add(group)
                //console.log(group)
                // #endregion
                // #region Thêm grid helper => debug
                // const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
                // grid.material.opacity = 0.2;
                // grid.material.transparent = true;
                // scene.add(grid);
                // #endregion
                // #region Load model
                const loader = new GLTFLoader();
                loader.load(pathModel, function (gltf) {
                    model = gltf.scene;
                    let scale = 3
                    model.scale.set(scale, scale, scale);

                    player = new THREE.Group();
                    player.name = 'Player'
                    player.add(model)
                    player.position.set(wayPoints[0].x, wayPoints[0].y, wayPoints[0].z);
                    scene.add(player);
                    lsReactive.push(player)
                    group = new THREE.Group();
                    group.name = 'Group_Character'
                    for (let ii = 0; ii < 6; ii++) {
                        let clone = model.clone(true);
                        let charater = new THREE.Group();
                        charater.name = 'Character'
                        charater.add(clone)

                        let [posX, posY, posZ] = getGridPoint(gridPoints[getRandomInt(0, gridPoints.length)])
                        charater.position.set(posX, posY, posZ);
                        buildAnim(clone, gltf.animations, charater)
                        lsReactive.push(charater)
                        setCharacter.add(charater)
                        group.add(charater);
                    }
                    scene.add(group);
                    console.log(player, group)
                    createGUI(model, gltf.animations);

                }, undefined, function (e) { console.error(e) })
                // #endregion
                // #region Tạo render add vào DOM
                container = document.createElement('div');
                document.body.appendChild(container);
                renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setAnimationLoop(renderFrame);
                container.appendChild(renderer.domElement);
                container.appendChild(stats.dom);
                // #endregion
                // #region Tạo Control camera
                controls = new OrbitControls(camera, renderer.domElement);
                controls.enableRotate = false;
                controls.enableDamping = true;
                //controls.enablePan = true;
                controls.zoomSpeed = 1.2;
                // #endregion
                window.addEventListener('resize', () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();

                    renderer.setSize(window.innerWidth, window.innerHeight);
                });
                // #region Tạo raycast để chạm điều khiền nhân vật
                const raycaster = new THREE.Raycaster();
                raycaster.layers.enable(0); // chỉ raycast với layer 0
                const mouse = new THREE.Vector2();
                const rayToControl = (event) => {
                    if (!clock.running) return;
                    // Chuyển đổi tọa độ chuột sang không gian Normalized Device Coordinates (-1 đến 1)
                    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                    raycaster.setFromCamera(mouse, camera); // Gán ray từ camera và tọa độ chuột

                    const intersects = raycaster.intersectObjects(lsReactive, true); // Kiểm tra va chạm với danh sách mesh (ví dụ: scene.children)
                    if (intersects.length > 0) {
                        const hit = intersects[0]; // đối tượng bị va chạm đầu tiên

                        const point = hit.point; // tọa độ điểm va chạm trong không gian 3D
                        const hitMesh = hit.object
                        const rotGrp = getRootGroupByName(hitMesh, setName)
                        if (2 === event.button) { // 2 là chuột phải
                            const targetPosition = point.clone();
                            targetPosition.y = player.position.y
                            switch (rotGrp.name) {
                                case 'Player': break;
                                case 'Group_Ground':
                                    if (!wayPoints.length) {
                                        wayPoints = buildWayPoints(player.position, targetPosition)
                                    } else if (!isEqualPos(wayPoints[0], point) && !isEqualPos(wayPoints[0], targetPosition)) {
                                        wayPoints = buildWayPoints(player.position, targetPosition)
                                    }
                                    break;
                                case 'Character': break;
                            }
                        }
                        console.group("Click vào mesh:")
                        console.log("Hit object:", hitMesh);
                        console.log('root group object: ', rotGrp)
                        console.log("Tọa độ va chạm:", point); // Vector3(x, y, z)
                        console.log('list way points: ', wayPoints.map(v3 => [v3.x, v3.y, v3.z]), player.position)
                        console.groupEnd()
                    }
                }
                window.addEventListener('mouseup', rayToControl);
                // #endregion
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
                document.addEventListener("keyup", (event) => {
                    switch (event.key) {
                        case "p": this.pauseGame('pause')
                            break;
                        case "r": this.pauseGame('resume')
                            break;
                    }
                });
                clock.start();
            }
            function getGridPoint(txtPos) { return txtPos.split('_').map(txt => parseFloat(txt)) }  // [x, y, z]
            function buildGridPoint(posX, posY, posZ) { return `${posX}_${posY}_${posZ}` }
            function getRootGroupByName(mesh, names = new Set()) {
                if (null == mesh) return mesh
                if (names.has(mesh.name)) return mesh
                let paLvl = mesh.parent
                if (null == paLvl) return mesh
                if ("Scene" == paLvl.type) return mesh
                if (names.has(paLvl.name)) return paLvl
                while (paLvl) {
                    if ("Scene" == paLvl.parent.type) return paLvl
                    paLvl = paLvl.parent
                    if (names.has(paLvl.name)) return paLvl
                }
                return mesh
            }
            function getTitleInGrid(posX) { return Math.round(posX / tileSize) + gridSize }
            function getPosFromGrid(tileX) { return (tileX - gridSize) * tileSize }
            function buildWayPoints(srcPos, desPos) {
                let des = { x: getTitleInGrid(srcPos.x), y: getTitleInGrid(srcPos.z) }
                let src = { x: getTitleInGrid(desPos.x), y: getTitleInGrid(desPos.z) }
                let paths = aStar(tileGrid, src, des)
                //  console.log(paths, src, des)
                if (1 < paths.length) paths.pop()   // Bỏ đi vị trí player đang đứng.
                paths = paths.map(ps => new THREE.Vector3(getPosFromGrid(ps.x), srcPos.y, getPosFromGrid(ps.y)))
                if (1 == paths.length && isEqualPos(paths[0], srcPos)) return []
                return paths
            }
            const updateHUD = () => {
                const elapsed = Math.floor(clock.getElapsedTime());
                if (t_Clok.totalSec != t_Clok.pauseSec + elapsed) {
                    t_Clok.totalSec = t_Clok.pauseSec + elapsed
                }
            }
            function renderFrame() {
                const dt = clock.getDelta();
                if (mixer) { mixer.update(dt) }
                for (const cha of setCharacter) {
                    const uData = cha.userData
                    uData.AnimMixer.update(dt)
                }
                if (clock.running) {
                    updateHUD(); // cập nhật HUD
                    goTo(player, moveSpeed)
                    updateIsometricCamera(camera, player); // camera bám theo nhân vật
                }
                renderer.render(scene, camera);
                stats.update(); // cập nhật FPS
            }
            function fadeToAction(name, duration) {
                if (activeAction._clip.name !== name) {
                    let prvA = activeAction
                    prvA.fadeOut(duration);

                    activeAction = actions[name];
                    activeAction
                        .reset()
                        .setEffectiveTimeScale(1)
                        .setEffectiveWeight(1)
                        .fadeIn(duration)
                        .play();
                }
            }
            function buildAnim(model, animations, character) {
                const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
                const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
                let mixer = new THREE.AnimationMixer(model);
                let actions = {};
                for (const clip of animations) {
                    const action = mixer.clipAction(clip);
                    actions[clip.name] = action;
                    if (0 <= emotes.indexOf(clip.name) || 4 <= states.indexOf(clip.name)) {
                        action.clampWhenFinished = true;
                        action.loop = THREE.LoopOnce;
                    }
                }
                const uData = character.userData
                uData.AnimMixer = mixer
                uData.AnimActions = actions

                let action = actions['Walking'];
                action.setLoop(THREE.LoopRepeat, Infinity); // Lặp vô hạn
                action.play();

                uData.AnimAction = action
            }
            function createGUI(model, animations) {

                const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
                const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

                gui = new GUI();

                mixer = new THREE.AnimationMixer(model);

                actions = {};

                for (let i = 0; i < animations.length; i++) {

                    const clip = animations[i];
                    const action = mixer.clipAction(clip);
                    actions[clip.name] = action;

                    if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

                        action.clampWhenFinished = true;
                        action.loop = THREE.LoopOnce;
                    }
                }

                // states
                const statesFolder = gui.addFolder('States');

                const clipCtrl = statesFolder.add(api, 'state').options(states);

                clipCtrl.onChange(function () {

                    fadeToAction(api.state, 0.5);
                });

                statesFolder.open();

                // emotes
                const emoteFolder = gui.addFolder('Emotes');

                function createEmoteCallback(name) {

                    api[name] = function () {

                        fadeToAction(name, 0.2);

                        mixer.addEventListener('finished', restoreState);
                    };

                    emoteFolder.add(api, name);
                }

                function restoreState() {

                    mixer.removeEventListener('finished', restoreState);

                    fadeToAction(api.state, 0.2);
                }

                for (let i = 0; i < emotes.length; i++) {

                    createEmoteCallback(emotes[i]);
                }

                emoteFolder.open();

                // expressions

                face = model.getObjectByName('Head_4');

                const expressions = Object.keys(face.morphTargetDictionary);
                const expressionFolder = gui.addFolder('Expressions');

                for (let i = 0; i < expressions.length; i++) {

                    expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);
                }

                activeAction = actions['Walking'];
                activeAction.play();

                expressionFolder.open();
            }
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
                if (!player) return
                if (wayPoints.length < 1) return;
                let targetPos3
                for (let ii = wayPoints.length - 1; -1 < ii; ii--) {
                    targetPos3 = wayPoints[ii]
                    if (0 < targetPos3.distanceToSquared(player.position)) {
                        player.lookAt(targetPos3)
                        const direction = targetPos3.clone().sub(player.position).normalize(); // Tính hướng đi từ vị trí hiện tại đến đích
                        player.position.add(direction.multiplyScalar(speed)); // Di chuyển theo hướng đó với tốc độ nhất định
                        if (player.position.distanceToSquared(targetPos3) < speed * speed) {
                            player.position.lerp(targetPos3, 0.003)
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
                return;
                if (!player) return;
                if (!offset) return;
                const targetPosition = player.position.clone();
                const cameraPosition = targetPosition.clone().add(offset);

                camera.position.lerp(cameraPosition, 0.03); // di chuyển mượt
                camera.lookAt(targetPosition);
            }
            function getRandomColor() {
                const r = Math.random();
                const g = Math.random();
                const b = Math.random();
                return new THREE.Color(r, g, b);
            }
            function getRandomInt(min, max) {   // include min, exclude max
                const minCeiled = Math.ceil(min);
                const maxFloored = Math.floor(max);
                return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
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
