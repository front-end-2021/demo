class Player {
    id = 0  // snowflake
    pos = [0, 0, 0]     // [x, y, z]    // float
    state = 'idle'  // 'walk', 'run', 'farm', 'attack'
    meta = {
        lsMesh: [],
        lsMat: [],
    }
}