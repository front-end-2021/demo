/**
 * main.js
 * ---------------------------------------------------------------
 * Entry point: khởi tạo PIXI.Application, gắn canvas vào #app,
 * tạo GameWorld, và chạy game loop bằng app.ticker.
 * Bản đồ (1400x900) thường lớn hơn màn hình nên ta scale toàn bộ
 * root container để luôn nhìn thấy toàn bản đồ (giống camera fit).
 * ---------------------------------------------------------------
 */
import { Application } from 'pixi.js';
import { GameWorld } from './systems/GameWorld.js';

const WORLD_W = 1400;
const WORLD_H = 900;

async function bootstrap() {
    const app = new Application();
    await app.init({
        background: '#1a1a1a',
        resizeTo: window,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true
    });

    document.getElementById('app').appendChild(app.canvas);

    const world = new GameWorld(app);

    function fitWorldToScreen() {
        const scale = Math.min(
            app.screen.width / WORLD_W,
            app.screen.height / WORLD_H
        ) * 0.96;
        world.root.scale.set(scale);
        world.root.x = (app.screen.width - WORLD_W * scale) / 2;
        world.root.y = (app.screen.height - WORLD_H * scale) / 2;
    }

    fitWorldToScreen();
    window.addEventListener('resize', fitWorldToScreen);

    app.ticker.add((ticker) => {
        const dt = ticker.deltaMS / 1000;
        world.update(dt);
    });
}

bootstrap();