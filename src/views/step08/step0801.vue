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
  camera.position.x = 30;
  camera.position.y = 30;
  camera.position.z = 30;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 灯光
  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(30,30,30)
  spotLight.castShadow = true
  scene.add(spotLight)

  // 辅助线
  let arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3( 0, 0, 0 ), 10, 0x0000ff);
  scene.add(arrow);

  // 平面图
  let ground = new THREE.PlaneGeometry(100,100,50,50)
  let groundMesh = new THREE.SceneUtils.createMultiMaterialObject(ground,[
    new THREE.MeshBasicMaterial({wireframe:true,overdraw:true,color:0x000000}),
    new THREE.MeshBasicMaterial({transparent:true,opacity:0.5,color:0x00ff00}),
  ])
  groundMesh.rotation.x = -0.5 * Math.PI
  scene.add(groundMesh)

  // 构建几何体
  function createMesh(geom:any) {
    let meshMaterial = new THREE.MeshNormalMaterial()
    meshMaterial.side = THREE.DoubleSide
    let wireFrameMat = new THREE.MeshBasicMaterial()
    wireFrameMat.wireframe = true
    let mesh = new THREE.SceneUtils.createMultiMaterialObject(geom,[meshMaterial,wireFrameMat])
    return mesh
  }

  let sphere = createMesh(new THREE.SphereGeometry(5,10,10))
  sphere.position.x = -5
  sphere.position.y = 4
  let cube = createMesh(new THREE.BoxGeometry(6,6,6))
  cube.position.x = 5
  cube.position.y = 4
  scene.add(sphere)
  scene.add(cube)

  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
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
