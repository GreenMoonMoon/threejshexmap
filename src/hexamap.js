var Hexamap;
(function (Hexamap) {
    const tempCellColor = [
        "#3a8e39",
        "#44270b",
        "#2155f2",
        "#bababa",
        "#e2d8b7"
    ];
    let Direction;
    (function (Direction) {
        Direction[Direction["NW"] = 0] = "NW";
        Direction[Direction["NE"] = 1] = "NE";
        Direction[Direction["E"] = 2] = "E";
        Direction[Direction["SE"] = 3] = "SE";
        Direction[Direction["SW"] = 4] = "SW";
        Direction[Direction["W"] = 5] = "W";
    })(Direction || (Direction = {}));
    const CubeDirectionValues = [
        new THREE.Vector3(0, 1, -1),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(0, -1, 1),
        new THREE.Vector3(-1, 0, 1),
        new THREE.Vector3(-1, 1, 0),
    ];
    const AxialDirectionValues = [
        new THREE.Vector3(0, -1),
        new THREE.Vector3(1, -1),
        new THREE.Vector3(1, 0),
        new THREE.Vector3(0, 1),
        new THREE.Vector3(-1, 1),
        new THREE.Vector3(-1, 0),
    ];
    class Generator {
        constructor(cellSize) {
            this.outerRadius = cellSize;
            this.innerRadius = cellSize * (Math.sqrt(3) / 2);
            this.width = cellSize * Math.sqrt(3);
            this.size = cellSize;
        }
        generate() {
            let grid = this.createGrid(10, 10);
            let geo = new THREE.Geometry();
            let verColor = [];
            for (let i = 0; i < grid.cells.length; i++) {
                let cell = grid.cells[i];
                let center = new THREE.Vector3(cell.coordinates.x * this.innerRadius * 2, 0, cell.coordinates.z * this.outerRadius * 1.5);
                center.x += this.innerRadius * (cell.coordinates.z % 2);
                geo.vertices.push(...this.getCorners(center));
                geo.faces.push(...this.getFaces(i));
                geo.faces[i * 4].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
                geo.faces[i * 4 + 1].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
                geo.faces[i * 4 + 2].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
                geo.faces[i * 4 + 3].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
            }
            geo.computeVertexNormals();
            let mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, shininess: 60 }));
            return mesh;
        }
        createGrid(width, height) {
            let grid = { cells: new Array() };
            for (let z = 0, i = 0, f = 0; z < height; z++) {
                for (let x = 0; x < width; x++, i += 6, f += 4) {
                    grid.cells.push({
                        coordinates: new THREE.Vector3(x, -x - z, z),
                        vertices: [i, i + 1, i + 2, i + 3, i + 4, i + 5],
                        faces: [f, f + 1, f + 2, f + 3],
                        tempColor: new THREE.Color(tempCellColor[Math.floor(Math.random() * tempCellColor.length)])
                    });
                }
            }
            return grid;
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
    function CubeToAxial(coordinate) {
        return new THREE.Vector2(coordinate.x, coordinate.z);
    }
    Hexamap.CubeToAxial = CubeToAxial;
    function AxialToCube(coordinate) {
        return new THREE.Vector3(coordinate.x, -coordinate.x - coordinate.y, coordinate.y);
    }
    Hexamap.AxialToCube = AxialToCube;
    function GetCubeDirection(direction) {
        return CubeDirectionValues[direction];
    }
    Hexamap.GetCubeDirection = GetCubeDirection;
    function GetCubeDirectionFromCell(cell, direction) {
        return cell.coordinates.add(CubeDirectionValues[direction]);
    }
    Hexamap.GetCubeDirectionFromCell = GetCubeDirectionFromCell;
    function GetAxialDirection(direction) {
        return AxialDirectionValues[direction];
    }
    Hexamap.GetAxialDirection = GetAxialDirection;
    function GetAxialDirectionFromCell(cell, direction) {
        return cell.coordinates.add(AxialDirectionValues[direction]);
    }
    Hexamap.GetAxialDirectionFromCell = GetAxialDirectionFromCell;
    function DistanceCube(a, b) {
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
    }
    Hexamap.DistanceCube = DistanceCube;
    function DistanceAxial(a, b) {
        return (Math.abs(a.x - b.x), Math.abs(a.x + a.y - b.x - b.y), Math.abs(a.y - b.y)) / 2;
    }
    Hexamap.DistanceAxial = DistanceAxial;
})(Hexamap || (Hexamap = {}));
//# sourceMappingURL=hexamap.js.map