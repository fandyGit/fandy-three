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
  camera.position.x = 50;
  camera.position.y = 50;
  camera.position.z = 50;
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
  spotLight.position.set(0, 50, 30);
  spotLight.intensity = 2;
  scene.add(spotLight);

  function getImageUrl(url:any) {
    return new URL(url, import.meta.url).href;
  }

  let mesh:any
  let loader = new THREE.OBJMTLLoader()
  loader.load(getImageUrl('../../assets/models/butterfly.obj'),getImageUrl('../../assets/models/butterfly.mtl'),function (object:any) {
    console.log('object',object)
    let wing1:any = object.children[4].children[0]
    wing1.material.opacity = 0.6;
    wing1.material.transparent = true;
    wing1.material.side= THREE.DoubleSide;
    wing1.material.depthTest = false;

    let wing2:any = object.children[5].children[0]
    wing2.material.opacity = 0.6;
    wing2.material.transparent = true;
    wing2.material.side= THREE.DoubleSide;
    wing2.material.depthTest = false;


    object.scale.set(140, 140, 140);
    mesh = object;
    scene.add(mesh);
  })


  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderScene()
  function renderScene() {
    stats.update()
    if (mesh) {
      mesh.rotation.y += 0.02;
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
