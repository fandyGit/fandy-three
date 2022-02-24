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
    document.getElementById('Stats-output').appendChild(state.domElement)
    return state
  }
  let stats = initState()
  // 场景
  let scene = new THREE.Scene()
  // 相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = 150;
  camera.position.y = 150;
  camera.position.z = 150;
  camera.lookAt(new THREE.Vector3(0, 10, 0));
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xaaaaff,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true
  scene.add(renderer)
  // 灯光
  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(150, 150, 150);
  spotLight.intensity = 2;
  scene.add(spotLight);

  function getImageUrl(url:any) {
    return new URL(url, import.meta.url).href;
  }

  var loader = new THREE.CTMLoader();
  var mesh = new THREE.Object3D();

  loader.load(getImageUrl('../../assets/models/auditt_wheel.ctm'),function (result:any) {
    console.log('result',result)
    let material = new THREE.MeshLambertMaterial({color:0x7777fff})
    mesh = new THREE.Mesh(result,material)
    mesh.rotation.x = -0.5 * Math.PI;
    mesh.scale.set(100,100,100)
    scene.add(mesh)

  })


  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    if(mesh){
      mesh.rotation.y += 0.1

    }
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
