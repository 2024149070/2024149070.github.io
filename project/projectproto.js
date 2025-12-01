// 05-both-cameras.js
// - PerspectiveCamera vs OrthographicCamera
// - OrbitControl change when camera changes

import * as THREE from 'three';  
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0); // 회색 배경
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);  // 원근감을 위한 안개

let isGameOver = false;

const camera_postitoin = new THREE.Vector3(0,3,6);

// Camera를 perspective와 orthographic 두 가지로 switching 해야 해서 const가 아닌 let으로 선언
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = camera_postitoin.x;
camera.position.y = camera_postitoin.y;
camera.position.z = camera_postitoin.z;
camera.lookAt(scene.position);
scene.add(camera);

const cameraP = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraP.position.x = camera_postitoin.x;
cameraP.position.y = camera_postitoin.y;
cameraP.position.z = camera_postitoin.z;
cameraP.lookAt(scene.position);


const cameraO = new THREE.OrthographicCamera(0,0,0,0,-200, 500);

matchOrthoToPerspective(cameraO, cameraP);
cameraO.position.x = camera_postitoin.x;
cameraO.position.y = camera_postitoin.y;
cameraO.position.z = camera_postitoin.z;
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
document.body.appendChild(stats.dom);

// Camera가 바뀔 때 orbitControls도 바뀌어야 해서 let으로 선언
let orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;


const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(-20, 40, 60);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x292929);
scene.add(ambientLight);


const platforms = []; // 충돌 체크를 위해 플랫폼들을 담을 배열

function creatPlatform(x, y, z_layer = 1, type = ''){
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshLambertMaterial();
    if(z_layer == 0){
        cubeMaterial.color = new THREE.Color(0, 1, 0);
    }
    else if(z_layer == 1){
        cubeMaterial.color = new THREE.Color(0, 1, 1);
    }
    else if(z_layer == 2){
        cubeMaterial.color = new THREE.Color(1, 1, 0);
    }
    else{
        cubeMaterial.color = new THREE.Color(0, 1, 0);
    }

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    const pos = zLayerToYZ(z_layer);
    cube.position.set(x,y,0);
    cube.position.add(pos);
    scene.add(cube);
    platforms.push(cube);
}
//y,z_layer
const map1 =[
    [[0,0]],
    [[0,0]],
    [],
    [],
    [[0,0]],
    [[0,0]]];
const map2 = [
    [[0,0]],
    [[0,0]],
    [[0,2]],
    [[0,2]],
    [[0,2]],
    [[0,0]],
];
const map3 = [
    [[0,0]],
    [[0,0]],
//    [[0,2],[1,2],[2,2],[3,2]],
    [[0,2]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
];
const map4 = [
    [[1,0]],
    [[1,0]],
    [[2,1]],
    [[2,1]],
    [[3,2]],
    [[3,2]],
];

const map5 = [
    [[1,1]],
    [[1,1]],
    [[1,1]],
    [[1,1]],
    [[1,1]],
    [[1,1]],
    
    [[0,2]],
    [[0,2]],
    [[0,2]],
    [[0,2]],
    [[0,2]],
    [[0,2]],
    
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
    [[0,0]],
];

const map6 = [
    [[0,1]],
    [[0,1]],
    [[0,1]],
    [[0,1]],
    [[0,1]],
    [[0,1]],
    [[0,2],[1,2],[2,2],[3,2],],
    [[0,1]],
    [[0,1]],
    [[0,1]],
    [[0,1]],
    [[0,1]],
    
];

creatPlatform(0,0,0);
let next_x = 0;
// for (let i = 1; i < 20; i++){
//     const z_layer = parseInt(Math.random() * 3);
//     creatPlatform(i,0,z_layer);
// }
for (const platformArr of map1) {
  for( const platform of platformArr){
    creatPlatform(next_x, platform[0],platform[1]);
  }
  next_x++;
}
for (const platformArr of map2) {
  for( const platform of platformArr){
    
    creatPlatform(next_x, platform[0],platform[1]);
  }
  next_x++;
}
for (const platformArr of map6) {
  for( const platform of platformArr){
    console.log(platform)
    creatPlatform(next_x, platform[0],platform[1]);
  }
  next_x++;
}
for (const platformArr of map4) {
  for( const platform of platformArr){
    creatPlatform(next_x, platform[0],platform[1]);
  }
  next_x++;
}
for (const platformArr of map5) {
  for( const platform of platformArr){
    creatPlatform(next_x, platform[0],platform[1]);
  }
  next_x++;
}



const playerGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); // 1x1 구멍에 안 걸리게 약간 작게
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xFF5733 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 3, 0); // 공중에서 시작
player.castShadow = true;
scene.add(player);

const playerSpeed = 0.03;
const jumpForce = 0.25;
const gravity = 0.01;

let velocity = new THREE.Vector3(0, 0, 0);
let onGround = false;
const keys = {
    ArrowRight: false,
    ArrowLeft: false,
    Space: false
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') keys.ArrowRight = true;
    if (e.code === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.code === 'Space') {
        if(onGround) { // 바닥에 있을 때만 점프
            velocity.y = jumpForce;
            onGround = false;
        }
        if(isGameOver) {
             start()
        }
    }
});
//  window.addEventListener('keyup', (e) => {
//     if (e.code === 'ArrowRight') keys.ArrowRight = false;
//     if (e.code === 'ArrowLeft') keys.ArrowLeft = false;
// });


const playerBox = new THREE.Box3();
const platformBox = new THREE.Box3();

function checkCollision() {
    onGround = false; 
    playerBox.setFromObject(player);

    for (let platform of platforms) {
        platformBox.setFromObject(platform);

        if (playerBox.intersectsBox(platformBox)) {
            
            // 1. 높이 판별을 위한 기준점 계산
            const playerBottom = player.position.y - 0.4;      // 캐릭터 발바닥 높이
            const platformTop = platform.position.y + 0.5;     // 블록 윗면 높이
            
            // 2. "밟았는가?" 판정
            // 발바닥이 블록 윗면보다 살짝 아래(-0.2)까지는 "밟은 것"으로 쳐줍니다.
            // (중력 때문에 프레임 사이사이 약간 파고들 수 있기 때문)
            const tolerance = 0.2; 

            if (playerBottom > platformTop - tolerance) {
                // [생존] 위에서 밟음 -> 착지 처리
                // 떨어지는 중일 때만 위로 보정 (점프해서 올라가는 중엔 뚫고 지나가도록)
                if (velocity.y <= 0) {
                    player.position.y = platformTop + 0.4;
                    velocity.y = 0;
                    onGround = true;
                }
            } 
            else {
                // [사망] 발바닥이 블록 윗면보다 한참 아래임 -> 즉, 몸통이나 머리가 부딪힘
                // 이건 빼박 측면(혹은 천장) 충돌이므로 사망 처리
                
                // 단, 천장(머리 찧기)는 살려주고 싶다면 velocity.y > 0 조건을 체크해서 제외 가능
                // 여기선 "측면 충돌 = 리셋" 요청에 따라 단순화
                 gameOver()

                return; // 즉시 종료
            }
        }
    }
}

let step = 0;

// GUI

let camearMode = "p";
//const clock = new THREE.Clock();
window.addEventListener('keydown', (e) => {
    if (e.key === 'p'){
        camearMode = "p";
        camera = cameraP
    };
    if (e.key === 'o') {
        camera = cameraO
        camearMode = "o";
    };
});

window.addEventListener('keyup', (e) => {
    if(e.key === 'o'){
        camera = cameraP
        camearMode = "p";
    }
});
function animate() {
    requestAnimationFrame(animate);

    if(!isGameOver){
        // 1) 좌우 이동
        player.position.x += playerSpeed;

        // 2) 중력 적용
        velocity.y -= gravity;
        player.position.y += velocity.y;

        if( camearMode == "o"){
            player.renderOrder = 999;
            player.material.depthTest = false; 
            player.material.depthWrite = false;
            console.log(camearMode);
            zZumpOnOrthographic();
        }
        else{
            player.renderOrder = 0;
            player.material.depthTest = true; 
            player.material.depthWrite = true;
        }
        // 3) 충돌 체크 및 위치 보정
        checkCollision();

        // 4) 낙사 처리 (너무 아래로 떨어지면 리셋)

        if (player.position.y < -20) {
                gameOver()
        }
    }


    // 5) 카메라가 플레이어를 따라다님 (횡스크롤)
    // 카메라는 X축만 따라가고, Y/Z는 고정
    // 부드러운 이동을 위해 lerp(선형 보간) 사용 가능하지만 여기선 직관적으로 바로 대입
    camera.position.x = player.position.x;
    camera.lookAt(player.position.x,0, 0);

    renderer.render(scene, camera);
}

animate();

// 각 투영에서 오브젝트 크기가 거의 비슷하게 만드는 함수
function matchOrthoToPerspective(orthoCam, perspCam, targetPos = new THREE.Vector3(0,0,0) ) {
    const distance  = perspCam.position.distanceTo(targetPos);
    const fovRad = THREE.MathUtils.degToRad(perspCam.fov);
    const height = 2 * distance * Math.tan(fovRad / 2);
    const width  = height * perspCam.aspect;

    orthoCam.left   = -width / 2;
    orthoCam.right  =  width / 2;
    orthoCam.top    =  height / 2;
    orthoCam.bottom = -height / 2;

    orthoCam.updateProjectionMatrix();
}

// 어떤 z축 줄에 배치할지를 입력하면 y,z 좌표가 나오는 함수. (맨 앞 레이어는 0)
function zLayerToYZ(z_layer=0){
    const z_gap = 2;
    const camera_tan = (camera_postitoin.z)/(camera_postitoin.y);
    const newZ = -z_gap*z_layer;
    const newY = newZ/camera_tan;
    return new THREE.Vector3(0,newY, newZ)
}
//z 좌표를 받으면 z-layer 값을 반환하는 함수
function ZToZLayer(z){
    const z_gap = 2
    const z_layer = -z/z_gap
    return z_layer
}

function gameOver(){
    isGameOver = true;
    console.log(player.position);
    velocity.set(0, 0, 0);
}
function start(){
    player.position.set(0, 3, 0);
    isGameOver = false;
}

function zZumpOnOrthographic(){
    const playerGridX = Math.round(player.position.x);

    // 모든 플랫폼을 순회하며 검사
    for (const platform of platforms) {
        // 플랫폼의 x좌표가 플레이어의 x좌표(정수)와 같은지 비교
        if (platform.position.x === playerGridX) {
            const player_z_layer = ZToZLayer(player.position.z)
            const platform_z_layer = ZToZLayer(platform.position.z);
            const translation = zLayerToYZ(platform_z_layer).clone().sub(zLayerToYZ(player_z_layer));
            console.log(player_z_layer);
            player.position.add(translation);
        }
    }

}

