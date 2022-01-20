<template>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  // 创建一个场景
  let scene = new THREE.Scene()
  // 创建一个相机
  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  // 创建一个渲染器
  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.shadowMapEnabled = true;

  // 坐标辅助线
  // let axis = new THREE.AxisHelper(20);
  // scene.add(axis);

  // 创建一个平面图
  let planeGeometry = new THREE.PlaneGeometry(60,20);
  let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
  let plane = new THREE.Mesh(planeGeometry,planeMaterial);
  plane.receiveShadow = true
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;

  scene.add(plane)

  // 创建一个立方体
  let cubeGeometry = new THREE.BoxGeometry(4,4,4)
  let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000})
  let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;
  cube.castShadow = true;

  scene.add(cube)
  //创建一个球体
  let sphereGeometry = new THREE.SphereGeometry(4,20,20);
  let sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
  let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);

  sphere.position.x = 20;
  sphere.position.y = 4;
  sphere.position.z = 2;
  sphere.castShadow = true;

  scene.add(sphere);

  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  // 添加点光
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40,60,-10);
  spotLight.castShadow = true;
  scene.add(spotLight);
  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)
  renderer.render(scene,camera);




})


</script>

<style lang="scss" scoped>
#WebGL-output{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

</style>
