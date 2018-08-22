namespace Hexamap {
    const tempCellColor = [
        "#3a8e39",
        "#44270b",
        "#2155f2",
        "#bababa",
        "#e2d8b7"
    ]

    enum Direction {
        NW,
        NE,
        E,
        SE,
        SW,
        W
    }

    const CubeDirectionValues = [
        new THREE.Vector3(0, 1, -1), //THREE.Vector3 are used here since there is not distinctions between int and floats in typescript.
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(0, -1, 1),
        new THREE.Vector3(-1, 0, 1),
        new THREE.Vector3(-1, 1, 0),
    ]

    const AxialDirectionValues = [
        new THREE.Vector3(0, -1),
        new THREE.Vector3(1, -1),
        new THREE.Vector3(1, 0),
        new THREE.Vector3(0, 1),
        new THREE.Vector3(-1, 1),
        new THREE.Vector3(-1, 0),
    ]

    export interface GeneratorParameters {
        size: number;
        padding: number;
        width: number;
        height: number;
    }

    interface Cell {
        coordinates: THREE.Vector3;
        vertices: number[];
        faces: number[];
    }

    export class Map {
        mesh: THREE.Mesh;
        cells: Cell[];
        private rowLength: number;

        public constructor(width: number) {
            this.cells = new Array<Cell>();
            this.mesh = new THREE.Mesh();
        }

        public GetCellAt(coordinate: THREE.Vector2): Cell {
            let h = this.Hash(coordinate);
            if (h > 0 && h < this.cells.length) {
                return this.cells[h];
            }
            return null;
        }

        private Hash(coordinate: THREE.Vector2): number {
            return (coordinate.x * this.rowLength) + coordinate.y;
        }
    }

    /**
     * This class is used to generate maps. I do not use the constructor in the class map, has I want to
     * move all unnecessary data and function out of the class. This class jobs is to crunches numbers and set
     * all map data.
     */
    export class Generator {
        private outerRadius: number;
        private innerRadius: number;
        private width: number;
        private height: number;
        private size: number;

        public constructor(parameters: GeneratorParameters) {
            this.size = parameters.size - parameters.size * parameters.padding;
            this.width = parameters.width;
            this.height = parameters.height;
            this.outerRadius = parameters.size;
            this.innerRadius = parameters.size * (Math.sqrt(3) / 2)
        }

        public generate(): Map {

            let map = this.GenerateMap(this.width, this.height);

            map.mesh.geometry = this.GenerateGeometry(map.cells);
            map.mesh.material = this.GenerateMaterial();

            return map;
        }

        private GenerateMap(width: number, height: number): Map {

            let map = new Map(width);
            for (let z = 0, i = 0, f = 0; z < height; z++) {
                for (let x = 0; x < width; x++ , i += 6, f += 4) {
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

        private GenerateGeometry(cells: Cell[]): THREE.Geometry {
            let geo = new THREE.Geometry();
            for (let index = 0; index < cells.length; index++) {
                // Create physical center for each cell.
                let center = new THREE.Vector3(cells[index].coordinates.x * this.innerRadius * 2, 2 * index, cells[index].coordinates.z * this.outerRadius * 1.5);
                center.x += this.innerRadius * (cells[index].coordinates.z % 2);

                geo.vertices.push(... this.GetCorners(center));
                geo.faces.push(... this.GetFaces(index))
            }

            for (let index = 2; index < cells.length; index++) {
                let vertices = this.GetDirectionCorner(cells[index - 1], 0);
                vertices.push(... this.GetDirectionCorner(cells[index], 3));

                geo.faces.push(...[
                    new THREE.Face3(vertices[0], vertices[1], vertices[2]),
                    new THREE.Face3(vertices[2], vertices[3], vertices[0])
                ])
            }

            geo.computeVertexNormals();

            return geo;
        }

        private GenerateMaterial(): THREE.MeshBasicMaterial {
            return new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, shininess: 60 });
        }

        private GetFaces(index: number): THREE.Face3[] {
            let minIndices = index * 6;
            let faces = [
                new THREE.Face3(0 + minIndices, 2 + minIndices, 1 + minIndices),
                new THREE.Face3(2 + minIndices, 0 + minIndices, 3 + minIndices),
                new THREE.Face3(0 + minIndices, 4 + minIndices, 3 + minIndices),
                new THREE.Face3(4 + minIndices, 0 + minIndices, 5 + minIndices),
            ];
            return faces;
        }

        private GetCorners(center: THREE.Vector3): THREE.Vector3[] {
            let corners = <THREE.Vector3[]>[];

            for (let i = 0; i < 6; i++) {
                let angle_deg = 60 * i - 30;
                let angle_rad = Math.PI / 180 * angle_deg;

                corners.push(
                    new THREE.Vector3(
                        center.x + this.size * Math.cos(angle_rad),
                        center.y,
                        center.z + this.size * Math.sin(angle_rad)
                    )
                );
            }

            return corners;
        }

        private GetDirectionCorner(cell: Cell, direction: Direction): number[] {
            return [cell.vertices[direction], cell.vertices[(direction + 1) % 6]];
        }

        private GetNeighbors(cell: Cell, direction: Direction): Cell {
            let neighborsCoordinate = cell.coordinates.add(GetAxialDirectionFromCell(cell, direction));
            console.log(neighborsCoordinate);

            return null;
        }
    }

    export function GetInvertDirection(direction: Direction): number {
        return (direction + 3) % 6;
    }

    export function CubeToAxial(coordinate: THREE.Vector3): THREE.Vector2 {
        return new THREE.Vector2(coordinate.x, coordinate.z);
    }

    export function AxialToCube(coordinate: THREE.Vector2): THREE.Vector3 {
        return new THREE.Vector3(coordinate.x, -coordinate.x - coordinate.y, coordinate.y);
    }

    export function GetCubeDirection(direction: Direction) {
        return CubeDirectionValues[direction];
    }

    export function GetCubeDirectionFromCell(cell: Cell, direction: Direction) {
        return cell.coordinates.add(CubeDirectionValues[direction]);
    }

    export function GetAxialDirection(direction: Direction) {
        return AxialDirectionValues[direction];
    }

    export function GetAxialDirectionFromCell(cell: Cell, direction: Direction) {
        return cell.coordinates.add(AxialDirectionValues[direction]);
    }

    export function DistanceCube(a: THREE.Vector3, b: THREE.Vector3) {
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
    }

    export function DistanceAxial(a: THREE.Vector2, b: THREE.Vector2) {
        return (Math.abs(a.x - b.x), Math.abs(a.x + a.y - b.x - b.y), Math.abs(a.y - b.y)) / 2
    }
}