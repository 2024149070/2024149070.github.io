/* -------------------------------------------------------------------------
12_ArcBall_TwoCubes_KeyControl.js
- 좌우 방향키로 큐브 이동
--------------------------------------------------------------------------- */

import { resizeAspectRatio, setupText, updateText, Axes } from '../util/util.js';
import { Shader, readShaderFile } from '../util/shader.js';
import { Cube } from '../util/cube.js';
import { Arcball } from '../util/arcball.js';

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');
let shader;
let textOverlay;
let isInitialized = false;

let viewMatrix = mat4.create();
let projMatrix = mat4.create();

const axes = new Axes(gl, 2.2);

let projectionMode = 'PERSPECTIVE';
const cameraPos = [0, 2, 5];

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) return;
    main().then(success => {
        if (!success) return;
        isInitialized = true;
    }).catch(console.error);
});

// ================================
// 사용자 지정 YZ 좌표 배열
// ================================
const positions = [
    {x:4, y: 0, z: 0 },
    {x:5, y: 0, z: 0 },
    //{x:6, y: 0, z: 0 },
    {x:7, y: 0, z: 0 },
    {x:8, y: -4, z: -10 },
    {x:9, y: -4, z: -10 },
    {x:10, y: -4, z: -10 },
    {x:11, y: -2, z: -5 },
    {x:11, y: -1, z: -5 },
    {x:13, y: -2, z: -5 },
    {x:14, y: -2, z: -5 },
    {x:15, y: -4, z: -10 },
    {x:16, y: -4, z: -10 },
    {x:17, y: -4, z: -10 },
    {x:18, y: -6, z: -15 },
    {x:18, y: -5, z: -15 },
    {x:18, y: -4, z: -15 },
    {x:19, y: -4, z: -10 },
    
];

// 큐브 배열 초기화
const cubes = [];
let count = 0;
for (let pos of positions) {
    const randomColor = [Math.random(), Math.random(), Math.random(), 1.0];
    const cube = new Cube(gl);
    cube.position = vec3.fromValues(pos.x, pos.y, pos.z);
    cubes.push(cube);
}

// ================================
// 키 입력 처리용 변수
// ================================
let moveDirection = 0; // -1: 왼쪽, +1: 오른쪽, 0: 정지

function setupKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') moveDirection = 1;
        else if (event.key === 'ArrowRight') moveDirection = -1;

        else if (event.key === 'p') {
            projectionMode = 'PERSPECTIVE';
            setupProjection();
            updateText(textOverlay, `projection: ${projectionMode}`);
        }
        else if (event.key === 'o') {
            projectionMode = 'ORTHOGRAPHIC';
            setupProjection();
            updateText(textOverlay, `projection: ${projectionMode}`);
        }
        else if (event.key === 'r') {
            moveDirection = 0;
            for (let i = 0; i < cubes.length; i++) {
                cubes[i].position[0] = 8 + i;
            }
            projectionMode = 'PERSPECTIVE';
            setupProjection();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') moveDirection = 0;
    });
}

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 is not supported by your browser.');
        return false;
    }
    canvas.width = 700;
    canvas.height = 700;
    resizeAspectRatio(gl, canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.2, 0.3, 1.0);
    return true;
}

async function initShader() {
    const vs = await readShaderFile('shVert.glsl');
    const fs = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vs, fs);
}

function setupProjection() {
    mat4.identity(projMatrix);
    const aspect = canvas.width / canvas.height;

    if (projectionMode === 'PERSPECTIVE') {
        mat4.perspective(projMatrix, glMatrix.toRadian(60), aspect, 0.1, 100.0);
    } else {
        const size = 3.0;
        mat4.ortho(projMatrix, -size * aspect, size * aspect, -size, size, 0.1, 100.0);
    }
}

// ================================
// render 함수
// ================================
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // 카메라 고정
    mat4.lookAt(viewMatrix, cameraPos, [0, 0, 0], [0, 1, 0]);
    shader.use();

    // 이동 처리
    for (let cube of cubes) {
        cube.position[0] += moveDirection * 0.05;

        // 경계 제한 (화면 밖으로 나가지 않게)
        if (cube.position[0] < -8) cube.position[0] = 8;
        let model = mat4.create();
        mat4.translate(model, model, cube.position);

        shader.setMat4('u_model', model);
        shader.setMat4('u_view', viewMatrix);
        shader.setMat4('u_projection', projMatrix);
        cube.draw(shader);
    }

    axes.draw(viewMatrix, projMatrix);
    requestAnimationFrame(render);
}

async function main() {
    if (!initWebGL()) return false;
    await initShader();

    mat4.lookAt(viewMatrix, cameraPos, [0, 0, 0], [0, 1, 0]);
    setupProjection();

    textOverlay = setupText(canvas, `projection: ${projectionMode}`, 1);
    setupText(canvas, "← / → to move cubes", 2);
    setupText(canvas, "p/o to switch projection", 3);
    setupText(canvas, "r to reset", 4);

    setupKeyboardEvents();
    requestAnimationFrame(render);
    return true;
}
