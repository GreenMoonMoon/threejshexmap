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
    class Map {
        constructor(width) {
            this.cells = new Array();
            this.mesh = new THREE.Mesh();
        }
        GetCellAt(coordinate) {
            let h = this.Hash(coordinate);
            if (h > 0 && h < this.cells.length) {
                return this.cells[h];
            }
            return null;
        }
        Hash(coordinate) {
            return (coordinate.x * this.rowLength) + coordinate.y;
        }
    }
    Hexamap.Map = Map;
    class Generator {
        constructor(parameters) {
            this.size = parameters.size - parameters.size * parameters.padding;
            this.width = parameters.width;
            this.height = parameters.height;
            this.outerRadius = parameters.size;
            this.innerRadius = parameters.size * (Math.sqrt(3) / 2);
        }
        generate() {
            let map = this.GenerateMap(this.width, this.height);
            map.mesh.geometry = this.GenerateGeometry(map.cells);
            map.mesh.material = this.GenerateMaterial();
            return map;
        }
        GenerateMap(width, height) {
            let map = new Map(width);
            for (let z = 0, i = 0, f = 0; z < height; z++) {
                for (let x = 0; x < width; x++, i += 6, f += 4) {
                    let cell = {
                        coordinates: new THREE.Vector3(x, -x - z, z),
                        vertices: [i, i + 1, i + 2, i + 3, i + 4, i + 5],
                        faces: [f, f + 1, f + 2, f + 3],
                    };
                    map.cells.push(cell);
                }
            }
            return map;
        }
        GenerateGeometry(cells) {
            let geo = new THREE.Geometry();
            for (let index = 0; index < cells.length; index++) {
                let center = new THREE.Vector3(cells[index].coordinates.x * this.innerRadius * 2, 2 * index, cells[index].coordinates.z * this.outerRadius * 1.5);
                center.x += this.innerRadius * (cells[index].coordinates.z % 2);
                geo.vertices.push(...this.GetCorners(center));
                geo.faces.push(...this.GetFaces(index));
            }
            for (let index = 2; index < cells.length; index++) {
                let vertices = this.GetDirectionCorner(cells[index - 1], 0);
                vertices.push(...this.GetDirectionCorner(cells[index], 3));
                geo.faces.push(...[
                    new THREE.Face3(vertices[0], vertices[1], vertices[2]),
                    new THREE.Face3(vertices[2], vertices[3], vertices[0])
                ]);
            }
            geo.computeVertexNormals();
            return geo;
        }
        GenerateMaterial() {
            return new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, shininess: 60 });
        }
        GetFaces(index) {
            let minIndices = index * 6;
            let faces = [
                new THREE.Face3(0 + minIndices, 2 + minIndices, 1 + minIndices),
                new THREE.Face3(2 + minIndices, 0 + minIndices, 3 + minIndices),
                new THREE.Face3(0 + minIndices, 4 + minIndices, 3 + minIndices),
                new THREE.Face3(4 + minIndices, 0 + minIndices, 5 + minIndices),
            ];
            return faces;
        }
        GetCorners(center) {
            let corners = [];
            for (let i = 0; i < 6; i++) {
                let angle_deg = 60 * i - 30;
                let angle_rad = Math.PI / 180 * angle_deg;
                corners.push(new THREE.Vector3(center.x + this.size * Math.cos(angle_rad), center.y, center.z + this.size * Math.sin(angle_rad)));
            }
            return corners;
        }
        GetDirectionCorner(cell, direction) {
            return [cell.vertices[direction], cell.vertices[(direction + 1) % 6]];
        }
        GetNeighbors(cell, direction) {
            let neighborsCoordinate = cell.coordinates.add(GetAxialDirectionFromCell(cell, direction));
            console.log(neighborsCoordinate);
            return null;
        }
    }
    Hexamap.Generator = Generator;
    function GetInvertDirection(direction) {
        return (direction + 3) % 6;
    }
    Hexamap.GetInvertDirection = GetInvertDirection;
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