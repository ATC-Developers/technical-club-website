const utils = {
    makeShape: function () {
        let shape;
        if (window.THREE && arguments.length) {
            console.log(arguments);
            const arry = arguments[0];
            shape = new THREE.Shape();
            shape.moveTo(arry[0][0], arry[0][1]);
            for (let i = 1; i < arry.length; i++) {
                shape.lineTo(arry[i][0], arry[i][1])
            }
            if (arguments.length > 1) {
                for (let i = 1; i < arguments.length; i++) {
                    const pathCoords = arguments[i];
                    const path = new THREE.Path();
                    path.moveTo(pathCoords[0][0], pathCoords[0][1]);
                    for (let i = 1; i < pathCoords.length; i++) {
                        path.lineTo(pathCoords[i][0], pathCoords[i][1])
                    }
                    shape.holes.push(path)
                }
            }
            return shape
        } else {
            console.error('Something wrong!')
        }
    },
    makeExtrudeGeometry: function (shape, amount) {
        const extrudeSetting = {
            steps: 1,
            amount: amount,
            bevelEnabled: false
        };
        const geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSetting);
        geometry.rotateX(-0.5 * Math.PI)
        return geometry
    },
    makeShapeGeometry: function (shapeCoords) {
        const shape = this.makeShape(shapeCoords);
        return new THREE.ShapeGeometry(shape);
    },
    makeMesh: function (type, geometry, color) {
        let material;
        if (type === 'lambert') {
            material = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true})
        } else if (type === 'phong') {
            material = new THREE.MeshPhongMaterial({color: 0xff0000, wireframe:true})
        } else {
            console.error('unrecognized type!')
        }

        const mesh = new THREE.Mesh(geometry, material);

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh

    }
}