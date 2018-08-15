var Hexamap;
(function (Hexamap) {
    class Generator {
        constructor(cellSize) {
            this.outerRadius = cellSize;
            this.innerRadius = cellSize * (Math.sqrt(3) / 2);
            this.size = cellSize;
        }
        generate() {
            let geo = new THREE.Geometry();
            for (let z = 0, i = 0; z < 10; z++) {
                for (let x = 0; x < 10; x++, i++) {
                    let center = new THREE.Vector3((x * this.innerRadius * 2), 0, z * this.outerRadius * 1.5);
                    center.x = center.x + (center.z * 0.5);
                    geo.vertices.push(...this.getCorners(center));
                    geo.faces.push(...this.getFaces(i));
                }
            }
            geo.computeVertexNormals();
            let mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
            return mesh;
        }
        getFaces(index) {
            let minIndices = index * 6;
            let faces = [
                new THREE.Face3(0 + minIndices, 2 + minIndices, 1 + minIndices),
                new THREE.Face3(2 + minIndices, 0 + minIndices, 3 + minIndices),
                new THREE.Face3(0 + minIndices, 4 + minIndices, 3 + minIndices),
                new THREE.Face3(4 + minIndices, 0 + minIndices, 5 + minIndices),
            ];
            return faces;
        }
        getCorners(center) {
            let corners = [];
            for (let i = 0; i < 6; i++) {
                let angle_deg = 60 * i - 30;
                let angle_rad = Math.PI / 180 * angle_deg;
                corners.push(new THREE.Vector3(center.x + this.size * Math.cos(angle_rad), center.y, center.z + this.size * Math.sin(angle_rad)));
            }
            return corners;
        }
    }
    Hexamap.Generator = Generator;
})(Hexamap || (Hexamap = {}));
//# sourceMappingURL=hexamap.js.map