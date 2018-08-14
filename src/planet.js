var Planets;
(function (Planets) {
    let midPointlookup = {};
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    let X = 0.525731112119133606;
    let Z = 0.850650808352039932;
    let icosahedronVertices = [
        -X, 0.0, Z, X, 0.0, Z, -X, 0.0, -Z, X, 0.0, -Z,
        0.0, Z, X, 0.0, Z, -X, 0.0, -Z, X, 0.0, -Z, -X,
        Z, X, 0.0, -Z, X, 0.0, Z, -X, 0.0, -Z, -X, 0.0
    ];
    let icosahedronTrianles = [
        0, 1, 4, 0, 4, 9, 9, 4, 5, 4, 8, 5, 4, 1, 8,
        8, 1, 10, 8, 10, 3, 5, 8, 3, 5, 3, 2, 2, 3, 7,
        7, 3, 10, 7, 10, 6, 7, 6, 11, 11, 6, 0, 0, 6, 1,
        6, 10, 1, 9, 11, 0, 9, 2, 11, 9, 5, 2, 7, 11, 2
    ];
    function generatePlanet() {
        let planetGeo = new THREE.BufferGeometry();
        planetGeo.addAttribute("position", new THREE.Float32BufferAttribute(icosahedronVertices, 3));
        planetGeo.setIndex(icosahedronTrianles);
        planetGeo.computeVertexNormals();
        let planetMesh = new THREE.Mesh(planetGeo, new THREE.MeshPhongMaterial({
            specular: 0xffff99,
            shininess: 250,
            color: 0xffaa00
        }));
        return planetMesh;
    }
    Planets.generatePlanet = generatePlanet;
})(Planets || (Planets = {}));
//# sourceMappingURL=planet.js.map