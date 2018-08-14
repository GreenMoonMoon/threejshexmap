namespace Hexamap{
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
            let geo = new THREE.Geometry();

            let center = new THREE.Vector3(0, 0, 0);
            geo.vertices.push(...this.getCorners(center));
            geo.faces.push(...this.getFaces(0));

            center = new THREE.Vector3(2*this.size, 5, 2*this.size);
            geo.vertices.push(...this.getCorners(center));
            geo.faces.push(...this.getFaces(1));

            center = new THREE.Vector3(5*this.size, -2, -2*this.size);
            geo.vertices.push(...this.getCorners(center));
            geo.faces.push(...this.getFaces(2));

            geo.computeVertexNormals();

            let mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({color: 0xFFFFFF}));

            return mesh;
        }

        private getFaces(index: number): THREE.Face3[]{
            let minIndices = index * 6;
            let faces = [
                new THREE.Face3(0+minIndices, 2+minIndices, 1+minIndices),
                new THREE.Face3(2+minIndices, 0+minIndices, 3+minIndices),
                new THREE.Face3(0+minIndices, 4+minIndices, 3+minIndices),
                new THREE.Face3(4+minIndices, 0+minIndices, 5+minIndices),
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