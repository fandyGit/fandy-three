<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
interface GeneratePoints {
(segments:number,radius:number,radiusSegments:number,closed:boolean) :void
}

onMounted(() => {
  function initState() {
    //@ts-ignore
    let state = new Stats()
    state.setMode(0)
    state.domElement.position = 'absolute'
    state.domElement.style.left = '0px'
    state.domElement.style.right = '0px'
    //@ts-ignore
    document.getElementById('Stats-output').append(state.domElement)
    return state
  }
  let stats = initState()
  // 场景
  let scene = new THREE.Scene()
  // 相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 40
  camera.lookAt(new THREE.Vector3(10,0,0))
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 灯光
  // let spotLight = new THREE.SpotLight(0x787878)
  // spotLight.position.set(-30,40,30)
  // spotLight.castShadow = true
  // scene.add(spotLight);
  var tubeMesh:any;
  var spGround: any;
  let generatePoints:GeneratePoints = (segments:number,radius:number,radiusSegments:number,closed:boolean) => {
    spGround = new THREE.Object3D()

    let points = []
    let material = new THREE.MeshBasicMaterial({color:0xff0000,transparent:true})
    for (let i = 0; i < 5; i++) {
      let randomX = -20 + Math.round(Math.random()*50)
      let randomY = -15 + Math.round(Math.random()*40)
      let randomZ = -20 + Math.round(Math.random()*40)
      points.push(new THREE.Vector3(randomX,randomY,randomZ))
    }
    points.forEach(function (point) {
      let spGeom = new THREE.SphereGeometry(0.2)
      let spMesh = new THREE.Mesh(spGeom,material)
      spMesh.position.copy(point)
      spGround.add(spMesh)
    })
    scene.add(spGround)

    let tubeGeometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points),segments,radius,radiusSegments,closed)
    tubeMesh = createMesh(tubeGeometry)
    scene.add(tubeMesh)
  }
  function createMesh(geom: any) {
    let meshMaterial = new THREE.MeshBasicMaterial({color:0x00ff00,transparent:true,opacity:0.3})
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial,wireFrameMat])
    return mesh
  }
  generatePoints(64,1,8,false)

  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.segments = 64;
    //@ts-ignore
    this.radius = 1;
    //@ts-ignore
    this.radiusSegments = 8;
    //@ts-ignore
    this.closed = false;
    //@ts-ignore
    this.draw = function () {
      scene.remove(spGround)
      scene.remove(tubeMesh)
      generatePoints(controls.segments,controls.radius,controls.radiusSegments,controls.closed)
    }

  }
  let gui = new dat.GUI()
  gui.add(controls,'segments',0,20).step(1).onChange(controls.draw)
  gui.add(controls,'radius',0,20).onChange(controls.draw)
  gui.add(controls,'radiusSegments',0,20).step(1).onChange(controls.draw)
  gui.add(controls,'closed').onChange(controls.draw)

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    spGround.rotation.y +=0.005
    tubeMesh.rotation.y +=0.005
    requestAnimationFrame(renderScene)
    renderer.render(scene,camera)
  }

})


</script>

<style lang="scss" scoped>
#WebGL-output{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

</style>
