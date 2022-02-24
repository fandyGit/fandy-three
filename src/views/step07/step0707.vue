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
  camera.position.x = 20;
  camera.position.y = 40;
  camera.position.z = 110;
  camera.lookAt(new THREE.Vector3(20, 30, 0));
  scene.add(camera)
  // 渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0x000000,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  scene.add(renderer)

  let cloud:any
  function getImageUrl() {
    return new URL(`../../assets/textures/particles/raindrop-3.png`, import.meta.url).href;
  }
  function createPointCloud(size:any,transparent:any,opacity:any,sizeAttenuation:any,color:any) {
    let textureGrass = THREE.ImageUtils.loadTexture(getImageUrl());
    let geom = new THREE.Geometry()
    let material = new THREE.PointCloudMaterial({
      size:size,
      transparent:transparent,
      opacity:opacity,
      map: textureGrass,
      blending: THREE.AdditiveBlending,
      sizeAttenuation:sizeAttenuation,
      color: color
    })
    let range = 50
    for (var i = 0; i < 1000; i++) {
      let particle = new THREE.Vector3(Math.random()*range - range/2,Math.random()*range * 10,Math.random()*range - range/2)
      particle.velocityY = 0.2 + Math.random() / 5;
      particle.velocityX = (Math.random() - 0.5) / 10;
      geom.vertices.push(particle)
    }

    cloud = new THREE.PointCloud(geom,material)
    cloud.name = 'pointCloud'
    cloud.sortParticles = true
    scene.add(cloud)
  }

  // @ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  createPointCloud(6,true,0.6,true,0xffffff)
  renderScene()
  function renderScene() {
    stats.update()
    var vertices = cloud.geometry.vertices;
    vertices.forEach(function (v:any) {
      v.y = v.y - (v.velocityY);
      v.x = v.x - (v.velocityX);

      if (v.y <= 0) v.y = 60;
      if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
    });
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
