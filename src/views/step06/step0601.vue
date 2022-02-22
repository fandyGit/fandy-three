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
  let spotLight = new THREE.SpotLight(0x787878)
  spotLight.position.set(-30,30,40)
  spotLight.castShadow = true
  scene.add(spotLight)
  let hullMesh:any = null
  let spGround:any = null
  generatePoints()
  // 生成随机点
  function generatePoints() {
    let points = []
    for (let i = 0; i < 20; i++) {
      let radomX = -15 + Math.round(Math.random()*30)
      let radomY = -15 + Math.round(Math.random()*30)
      let radomZ = -15 + Math.round(Math.random()*30)
      points.push(new THREE.Vector3(radomX,radomY,radomZ))
    }
    spGround = new THREE.Object3D()
    let meshMaterial = new THREE.MeshBasicMaterial({color:0xff0000,transparent:false})
    points.forEach(function (point) {
        let spGeo = new THREE.SphereGeometry(0.2)
        let spMesh = new THREE.Mesh(spGeo,meshMaterial)
        spMesh.position.copy(point)
        spGround.add(spMesh);
    })
    scene.add(spGround)
    // 构建凸包
    let hullGeometry = new THREE.ConvexGeometry(points)
    hullMesh = createMesh(hullGeometry)
    scene.add(hullMesh)
  }

  function createMesh(geo:any) {
    let meshMaterial = new THREE.MeshBasicMaterial({color:0x00ff00,transparent: true, opacity: 0.2})
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geo,[meshMaterial,wireFrameMat])
    return mesh

  }
  //@ts-ignore
  let controls = new function() {
    //@ts-ignore
    this.redraw = function (){
      scene.remove(spGround)
      scene.remove(hullMesh)
      generatePoints();
    }
  }

  let gui = new dat.GUI()
  gui.add(controls,'redraw')

  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    spGround.rotation.y += 0.01;
    hullMesh.rotation.y += 0.01;
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
