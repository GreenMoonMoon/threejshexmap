let renderer;
let scene;
let camera;
let controls;
function setup() {
    renderer = new THREE.WebGLRenderer();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    controls = new THREE.OrbitControls(camera);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0.9, 0.9, 1.0);
    camera.position.z = 10;
    let ambientLight = new THREE.AmbientLight(0x8888ff, 0.5);
    scene.add(ambientLight);
    let sunLight = new THREE.DirectionalLight(0xfffff0, 1.0);
    sunLight.position.set(1, 1, 1);
    scene.add(sunLight);
    let hexGen = new Hexamap.Generator(10);
    let map = hexGen.generate();
    scene.add(map);
    let testPoint = new THREE.Points(map.geometry, new THREE.PointsMaterial({ color: 0x000000 }));
    scene.add(testPoint);
}
function update() {
    controls.update();
}
function draw() {
    renderer.render(scene, camera);
}
function loop() {
    requestAnimationFrame(loop);
    update();
    draw();
}
setup();
loop();
//# sourceMappingURL=main.js.map