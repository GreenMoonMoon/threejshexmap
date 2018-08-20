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

    interface Cell {
        coordinates: THREE.Vector3
        vertices: number[],
        faces: number[]
        tempColor: THREE.Color
    }

    export interface Grid {
        cells: Cell[];
    }

    export class Generator {
        private outerRadius: number;
        private innerRadius: number;
        // private width: number;
        private size: number;
        // private padding: number;

        public constructor(cellSize: number, padding: number) {
            this.size = cellSize - cellSize * padding;
            this.outerRadius = cellSize;
            this.innerRadius = cellSize * (Math.sqrt(3) / 2)
            // this.width = cellSize * Math.sqrt(3);
            // this.padding = padding * cellSize;
        }

        public generate(): THREE.Mesh {

            let grid = this.createGrid(10, 10);

            let geo = new THREE.Geometry();

            for (let i = 0; i < grid.cells.length; i++) {
                let cell = grid.cells[i];
                let center = new THREE.Vector3(cell.coordinates.x * this.innerRadius * 2, 0, cell.coordinates.z * this.outerRadius * 1.5);
                center.x += this.innerRadius * (cell.coordinates.z % 2);

                geo.vertices.push(... this.getCorners(center));
                geo.faces.push(... this.getFaces(i))

                geo.faces[i * 4].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
                geo.faces[i * 4 + 1].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
                geo.faces[i * 4 + 2].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
                geo.faces[i * 4 + 3].vertexColors = [cell.tempColor, cell.tempColor, cell.tempColor];
            }

            geo.computeVertexNormals();
            let mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors, shininess: 60 }));

            for(let cell of grid.cells){
                for(let direction = 0; direction < 6; direction++){
                    let n = this.GetNeighbors(cell, direction);
                }
            }

            return mesh;
        }

        private createGrid(width: number, height: number): Grid {

            let grid = { cells: new Array<Cell>() };
            for (let z = 0, i = 0, f = 0; z < height; z++) {
                for (let x = 0; x < width; x++ , i += 6, f += 4) {
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

        private getFaces(index: number): THREE.Face3[] {
            let minIndices = index * 6;
            let faces = [
                new THREE.Face3(0 + minIndices, 2 + minIndices, 1 + minIndices),
                new THREE.Face3(2 + minIndices, 0 + minIndices, 3 + minIndices),
                new THREE.Face3(0 + minIndices, 4 + minIndices, 3 + minIndices),
                new THREE.Face3(4 + minIndices, 0 + minIndices, 5 + minIndices),
            ];
            return faces;
        }

        private getCorners(center: THREE.Vector3): THREE.Vector3[] {
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