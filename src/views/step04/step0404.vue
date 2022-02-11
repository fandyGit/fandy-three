<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import {onMounted, render} from 'vue'
onMounted(() => {
  function initState() {
    //@ts-ignore
    let stats = new Stats()
    stats.setMode(0)
    stats.domElement.position = 'absolute'
    stats.domElement.left = '0px'
    stats.domElement.top = '0px'
    //@ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
  }
  let stats = initState()
  //场景
  let scene = new THREE.Scene()
  // 照相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 40
  camera.lookAt(new THREE.Vector3(10,0,0))
  scene.add(camera)

  //渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)

  // 环境光
  let ambientLight = new THREE.AmbientLight(0x666666)
  scene.add(ambientLight)

  // 平面图
  let groundGeometry = new THREE.PlaneGeometry(60,40)
  let groundMaterial = new THREE.MeshLambertMaterial({color:Math.random()*0x777777})
  let ground = new THREE.Mesh(groundGeometry,groundMaterial)
  ground.rotation.x = -0.5 * Math.PI
  ground.position.x = 3
  ground.position.y = 0
  ground.position.z = 0

  ground.receiveShadow = true
  scene.add(ground)

  // 创建三个图形
  let sphereGeometry = new THREE.SphereGeometry(14,20,20)
  let cubeGeometry = new THREE.BoxGeometry(14,14,14)
  let planeGeometry = new THREE.PlaneGeometry(14,14,4,4)

  // 创建共有材质
  var meshMaterial = new THREE.MeshNormalMaterial({color:0x777777})
  var sphere = new THREE.Mesh(sphereGeometry,meshMaterial)
  var cube = new THREE.Mesh(cubeGeometry,meshMaterial)
  var plane = new THREE.Mesh(planeGeometry,meshMaterial)

  sphere.position.x = 0
  sphere.position.y = 3
  sphere.position.z = 2


  // 法向量箭头
  for (var f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {
    var face = sphere.geometry.faces[f]
    var centroid = new THREE.Vector3(0, 0, 0)
    centroid.add(sphere.geometry.vertices[face.a])
    centroid.add(sphere.geometry.vertices[face.b])
    centroid.add(sphere.geometry.vertices[face.c])

    centroid.divideScalar(3)
    var arrow =new THREE.ArrowHelper(
        face.normal,
        centroid,
        2,
        0x33ff77,
        0.5,
        0.5
    )
    sphere.add(arrow)
  }



  cube.position.clone(sphere.position)
  plane.position.clone(sphere.position)
  scene.add(cube)


  // 点光
  let spotLight = new THREE.SpotLight(0xeeeeee)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)

  // 控制器
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.rotationSpeed = 0.01
    //@ts-ignore
    this.opacity = meshMaterial.opacity
    //@ts-ignore
    this.transparent = meshMaterial.transparent
    //@ts-ignore
    this.visible = meshMaterial.visible
    //@ts-ignore
    this.side = 'front'
    //@ts-ignore
    this.selectedMesh = 'cube'
    //@ts-ignore
    this.shadow = 'flat'
    //@ts-ignore
    this.wireframe = meshMaterial.wireframe
    //@ts-ignore
    this.wireframeLinewidth = meshMaterial.wireframeLinewidth
  }

  let gui = new dat.GUI()
  let spGui = gui.addFolder('Mesh')
  spGui.add(controls,'opacity',0,1).onChange(function (e:any){
    meshMaterial.opacity = e
  })
  spGui.add(controls,'transparent').onChange(function (e:any){
    meshMaterial.transparent = e
  })
  spGui.add(controls,'visible').onChange(function (e:any){
    meshMaterial.visible = e
  })
  spGui.add(controls,'wireframe').onChange(function (e:any){
    meshMaterial.wireframe = e
  })
  spGui.add(controls,'wireframeLinewidth',1,20).onChange(function (e:any){
    meshMaterial.wireframeLinewidth = e
  })
  spGui.add(controls,'side',['front','back','double']).onChange(function (e:any){
    switch (e) {
      case 'front':
        meshMaterial.side = THREE.FrontSide
        break
      case 'back':
        meshMaterial.side = THREE.BackSide
        break
      case "double":
        meshMaterial.side = THREE.DoubleSide;
        break;
    }
  })
  spGui.add(controls,'selectedMesh',['cube','sphere','plane']).onChange(function (e:any){
    scene.remove(sphere)
    scene.remove(cube)
    scene.remove(plane)
    switch (e) {
      case 'cube':
        scene.add(cube)
        break
      case 'sphere':
        scene.add(sphere)
        break
      case "plane":
        scene.add(plane)
        break;
    }
    scene.add(e)
  })
  spGui.add(controls,'shadow',['flat','smooth']).onChange(function (e:any){
    switch (e) {
      case 'flat':
        meshMaterial.shading = THREE.FlatShading
        break
      case 'smooth':
        meshMaterial.shading = THREE.SmoothShading
        break
    }

    let oldPos = sphere.position.clone()
    scene.remove(sphere)
    scene.remove(cube)
    scene.remove(plane)
    sphere = new THREE.Mesh(sphere.geometry.clone(), meshMaterial)
    cube = new THREE.Mesh(cube.geometry.clone(), meshMaterial)
    plane = new THREE.Mesh(plane.geometry.clone(), meshMaterial)

    sphere.position.clone(oldPos)
    cube.position.clone(oldPos)
    plane.position.clone(oldPos)

    switch (controls.selectedMesh) {
      case 'cube':
        scene.add(cube)
        break
      case 'sphere':
        scene.add(sphere)
        break
      case 'plane':
        scene.add(plane)
        break
    }
    meshMaterial.needsUpdate = true;

  })
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  //渲染函数
  function renderScene() {
    stats.update()
    sphere.rotation.y += controls.rotationSpeed
    cube.rotation.y += controls.rotationSpeed
    plane.rotation.y += controls.rotationSpeed

    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }
  renderScene()



})


</script>

<style lang="scss" scoped>
#WebGL-output{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

</style>
