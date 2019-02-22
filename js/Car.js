"use strict"

function Car(color) {

  this.color = color || 0xffde00;
  this.mesh = new THREE.Object3D();
  this.wheels = []
  this.startAngle = 0

  var that = this
  addBody()
  addWindows()
  addLights()
  addWheels()

  function addWheels() {
    var wheelFrontLeft = createWheel()
    wheelFrontLeft.position.set(22, 3, -6)
    that.wheels.push(wheelFrontLeft)
    that.mesh.add(wheelFrontLeft)

    var wheelFrontRight = createWheel()
    wheelFrontRight.position.set(22, 3, 6)
    that.wheels.push(wheelFrontRight)
    that.mesh.add(wheelFrontRight)

    var wheelBackLeft = createWheel()
    wheelBackLeft.position.set(-13, 3, 6)
    that.wheels.push(wheelBackLeft)
    that.mesh.add(wheelBackLeft)

    var wheelBackRight = createWheel()
    wheelBackRight.position.set(-13, 3, -6)
    that.wheels.push(wheelBackRight)
    that.mesh.add(wheelBackRight)

    function createWheel() {
      var wheel = new THREE.Object3D()

      var wheelOuterGeometry = new THREE.CylinderGeometry(3, 3, 3, 32)
      wheelOuterGeometry.rotateX(0.5 * Math.PI)
      var wheelOuter = utils.makeMesh('lambert', wheelOuterGeometry, 0x000000)
      wheel.add(wheelOuter)

      var wheelInner = utils.makeMesh('lambert', wheelOuterGeometry, 0xdddddd)
      wheelInner.castShadow = false
      wheelInner.scale.set(0.8, 0.8, 1.1)
      wheel.add(wheelInner)

      var wheelCenterGeometry = new THREE.CylinderGeometry(1, 1, 3.6, 4)
      wheelCenterGeometry.rotateX(0.5 * Math.PI)
      var wheelCenter = utils.makeMesh('lambert', wheelCenterGeometry, 0xa7a7a7)
      wheelCenter.castShadow = false
      wheel.add(wheelCenter)

      return wheel
    }
  }

  function addLights() {
    var carLightsGeometry = new THREE.Geometry()
    var carLigetGeometry = new THREE.BoxGeometry(2, 2, 2)

    var carLightsPosition = [
      [32.5, 7.1, 6.1],
      [32.5, 7.1, -6.1],
      [-24, 7.1, 6.1],
      [-24, 7.1, -6.1]
    ]
    carLightsPosition.forEach(function(elem) {
      var x = elem[0],
        y = elem[1],
        z = elem[2]
      var geometry = carLigetGeometry.clone()
      geometry.translate(x, y, z)
      carLightsGeometry.merge(geometry)
    })

    var carLightFrontGeometry = carLigetGeometry.clone()
    carLightFrontGeometry.scale(1, 1.3, 7.1)
    carLightFrontGeometry.translate(32.1, 3.3, 0)
    carLightsGeometry.merge(carLightFrontGeometry)

    var carLightBackGeometry = carLightFrontGeometry.clone()
    carLightBackGeometry.translate(-56, 0, 0)
    carLightsGeometry.merge(carLightBackGeometry)

    carLightsGeometry = new THREE.BufferGeometry().fromGeometry(carLightsGeometry);
    var carLights = utils.makeMesh('phong', carLightsGeometry, 0xffffff);
    that.mesh.add(carLights)

  }

  function addWindows() {
    var carWindows = new THREE.Object3D()

    var carWindowLeft = new THREE.Object3D()
    var carWindowLeftFrontCoords = [
      [20, 10],
      [30, 10],
      [25.5, 18],
      [20, 18]
    ]
    var carWindowLeftFront = makeWindow(carWindowLeftFrontCoords)
    carWindowLeft.add(carWindowLeftFront)
    carWindowLeft.position.z = 7.1
    carWindows.add(carWindowLeft)

    const carWindowRight = carWindowLeft.clone()
    carWindowRight.position.z = -7.1
    carWindows.add(carWindowRight)

    const carWindowFrontGeometry = new THREE.CubeGeometry(0.1, 8, 13)
    carWindowFrontGeometry.rotateZ(0.17 * Math.PI)
    carWindowFrontGeometry.translate(29.4, 16, 0)
    const carWindowFront = utils.makeMesh('phong', carWindowFrontGeometry, 0x000000)
    carWindows.add(carWindowFront)

    that.mesh.add(carWindows)
  }

  function addBody() {
    var carBodyCoords = [
        [-23, 2],
        [33, 2],
        [33, 10],
        [27, 20],
        [-23, 20],
        [-23, 2]
    ]
    var carBodyShape = utils.makeShape(carBodyCoords)
    var carBodyGeometry = utils.makeExtrudeGeometry(carBodyShape, 14)
    carBodyGeometry.translate(0, -7, 0)
    carBodyGeometry.rotateX(0.5 * Math.PI)
    var carBody = utils.makeMesh('phong', carBodyGeometry, that.color)
    that.mesh.add(carBody)
  }

  function makeWindow(coords) {
    var windowColor = 0x000000
    var shape = utils.makeShape(coords)
    var geometry = utils.makeExtrudeGeometry(shape, 0.1)
    geometry.rotateX(0.5 * Math.PI)
    var mesh = utils.makeMesh('phong', geometry, windowColor)
    mesh.castShadow = false
    return mesh
  }
}
Car.prototype = {
  setPosition: function(x, y, z) {
    this.mesh.position.set(x, y, z)
  },
  forward: function(speed) {
    var speed = speed || 1
    this._moving(speed, true)
  },
  backward: function(speed) {
    var speed = speed || 1
    this._moving(speed, false)
  },
  turnLeft: function(angle, speed) {
    this._turn(angle, true, speed)
  },
  turnRight: function(angle, speed) {
    this._turn(angle, false, speed)
  },
  _turn: function(angle, direction, speed) {
    var direction = direction ? 1 : -1
    if (speed) {
      if (this.startAngle < angle) {
        this.mesh.rotation.y += speed
        this.startAngle += speed
        if (angle - this.startAngle < speed) {
          var originAngle = this.mesh.rotation.y - this.startAngle
          this.mesh.rotation.y = originAngle + angle
          this.startAngle = 0
          return
        }
      }
    } else {
      this.mesh.rotation.y += angle * direction
    }
  },
  _moving: function(speed, direction) {
    var rotation = this.mesh.rotation.y
    var direction = direction ? 1 : -1
    var xLength = speed * Math.cos(rotation) * direction,
      zLength = speed * Math.sin(rotation) * direction
    this.mesh.position.x += xLength
    this.mesh.position.z -= zLength
    this._rotateWheels(speed)
  },
  _rotateWheels: function(speed) {
    this.wheels.forEach(function(elem) {
      elem.rotation.z -= 0.1 * speed
    })
  }
}