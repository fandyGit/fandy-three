<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
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
  camera.lookAt(scene.position)
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xffffff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 点光
  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)
  generatePoints(10,2, 2*Math.PI);

  var spGroup: any
  var latheMesh: any
  function generatePoints(segments:any,phiStart:any,phiLength:any) {
    let points = []
    let height = 5
    let count = 30
    for (var i = 0; i < count; i++) {
      points.push(new THREE.Vector3((Math.sin(i * 0.2)+Math.cos(i* 0.3)*height + 12),0,(i-count)+count/2))
    }

    spGroup = new THREE.Object3D()
    let material = new THREE.MeshBasicMaterial({color:0xff0000,transparent:false})
    points.forEach(function (point) {
        let spGeom = new THREE.SphereGeometry(0.2)
        let spMesh = new THREE.Mesh(spGeom,material)
        spMesh.position.copy(point)
        spGroup.add(spMesh)
    })
    scene.add(spGroup)
    let latheGeometry = new THREE.LatheGeometry(points,segments,phiStart,phiLength)
    latheMesh = createMesh(latheGeometry)
    scene.add(latheMesh)
  }
  function createMesh(geom: any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geom,[meshMaterial,wireFrameMat])
    return mesh
  }
  //@ts-ignore
  let controls = new function () {
    //@ts-ignore
    this.segments = 12
    //@ts-ignore
    this.phiStart = 0
    //@ts-ignore
    this.phiLength = 2 * Math.PI
    //@ts-ignore
    this.redraw = function () {
      scene.remove(spGroup)
      scene.remove(latheMesh)
      generatePoints(controls.segments,controls.phiStart,controls.phiLength)
    }
  }
  let gui = new dat.GUI()
  gui.add(controls,'segments',0,50).step(1).onChange(controls.redraw)
  gui.add(controls,'phiStart',0,2*Math.PI).onChange(controls.redraw)
  gui.add(controls,'phiLength',0,2*Math.PI).onChange(controls.redraw)

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    // spGroup.rotation.y +=0.05
    // latheMesh.rotation.y +=0.05
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
