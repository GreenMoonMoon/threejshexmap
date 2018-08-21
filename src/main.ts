let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let raycaster: THREE.Raycaster;
let controls: THREE.OrbitControls;

function setup(){
    renderer = new THREE.WebGLRenderer();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    raycaster = new THREE.Raycaster();
    controls = new THREE.OrbitControls(camera);

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    
    scene.background = new THREE.Color(0.9, 0.9, 1.0);
    camera.position.x = 80;
    camera.position.y = 40;
    camera.position.z = -15;
    camera.rotateX(-2.5);
    camera.rotateZ(3.5);
    
    let ambientLight = new THREE.AmbientLight(0x8888ff, 0.5);
    scene.add(ambientLight);
    
    let sunLight = new THREE.DirectionalLight(0xfffff0, 1.0);
    sunLight.position.set(1, 1, 1);
    scene.add(sunLight);

    let hexGen = new Hexamap.Generator({size: 10, padding: 0.25, width: 2, height: 2});
    let map = hexGen.generate();
    scene.add(map.mesh);
}

function update(){
    controls.update();
}

function draw(){
    renderer.render(scene, camera);
}

function loop(){
    requestAnimationFrame(loop);
    update();
    draw();
}

setup();
loop();