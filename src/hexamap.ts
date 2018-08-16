namespace Hexamap{
    const cellColor = [
        "#3a8e39",
        "#44270b",
        "#2155f2",
        "#bababa",
        "#e2d8b7"
    ]

    interface Coordinate {
        x: number
        y: number
        z: number
    }

    interface Cell {
        coordinates: Coordinate
        vertices: number[], faces: number[]
        color: THREE.Color
    }

    export class Grid{
        public cells: Cell[];

        public constructor(width: number, height: number){
            this.cells = [];
            for(let z=0, i=0, f=0; z < height; z++){
                for(let x = 0; x < width; x++, i+=6, f+=4){
                    this.cells.push({
                        coordinates: {x: x, y: -x-z, z: z},
                        vertices: [i, i+1, i+2, i+3, i+4, i+5],
                        faces: [f, f+1, f+2, f+3],
                        color: new THREE.Color(cellColor[Math.floor(Math.random() * cellColor.length)])
                    });
                }
            }
        }
    }

    export class Generator{
        private outerRadius: number;
        private innerRadius: number;
        private size: number;

        public constructor(cellSize: number){
            this.outerRadius = cellSize;
            this.innerRadius = cellSize * (Math.sqrt(3)/2)
            this.size = cellSize;
        }

        public generate(): THREE.Mesh {

            let grid = new Grid(10, 10);
            let geo = new THREE.Geometry();
            let verColor = [];

            // geo.vertices.push(...this.getCorners(center));
            // geo.faces.push(...this.getFaces(0));
            for(let i = 0; i < grid.cells.length; i++){
                let cell = grid.cells[i];
                let center = new THREE.Vector3(cell.coordinates.x * this.innerRadius * 2, 0, cell.coordinates.z * this.outerRadius * 1.5);
                center.x += this.innerRadius * (cell.coordinates.z %2);

                geo.vertices.push(... this.getCorners(center));
                geo.faces.push(... this.getFaces(i))

                geo.faces[i * 4].vertexColors = [cell.color, cell.color, cell.color];
                geo.faces[i * 4 + 1].vertexColors = [cell.color, cell.color, cell.color];
                geo.faces[i * 4 + 2].vertexColors = [cell.color, cell.color, cell.color];
                geo.faces[i * 4 + 3].vertexColors = [cell.color, cell.color, cell.color];
            }

            geo.computeVertexNormals();
            let mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors}));

            return mesh;
        }

        private getFaces(index: number): THREE.Face3[]{
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
            
            for(let i=0; i < 6; i++){
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
    }
}