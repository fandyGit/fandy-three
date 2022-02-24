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
  renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0))
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
  let loader = new THREE.OBJLoader()
  loader.load(getImageUrl('../../assets/models/pinecone.obj'),function (loadedMesh:any) {
    let material = new THREE.MeshLambertMaterial({color:0x5C3A21})
    loadedMesh.children.forEach(function (child:any){
        child.material = material
        child.geometry.computeFaceNormals()
        child.geometry.computeVertexNormals()
    })
    console.log(loadedMesh)
    loadedMesh.scale.set(100,100,100)
    loadedMesh.rotation.x = -0.3
    mesh = loadedMesh
    scene.add(loadedMesh)
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
