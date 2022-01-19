<template>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  onMounted(() => {
    // 创建一个场景
    let scene:any = new THREE.Scene()
    // 创建一个摄像头
    let camera: any = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
    // 创建一个渲染器
    let renderer: any = new THREE.WebGLRenderer()
    renderer.setClearColorHex();
    renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0))
    renderer.setSize(window.innerWidth,window.innerHeight)

    let AxisHelper = new THREE.AxisHelper(20)
    scene.add(AxisHelper)

    // 创建几何体
    var planeGeometry: any = new THREE.PlaneGeometry(50,30)
    // 创建材质
    var planeMaterial:any = new THREE.MeshBasicMaterial({color:0xcccccc})
    let plane = new THREE.Mesh(planeGeometry,planeMaterial)

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane)

    let cubeGeometry = new THREE.BoxGeometry(4,4,4)
    let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfff000})
    let cube = new THREE.Mesh(cubeGeometry,cubeMaterial)

    cube.position.x = -10;
    cube.position.y = 10;
    cube.position.z = 4;
    scene.add(cube)

    let sphereGeometry = new THREE.SphereGeometry(6,20,20)
    let sphereMaterial = new THREE.MeshBasicMaterial({color:0x909909})//,wireframe:true
    let sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)

    sphere.position.x = 20
    sphere.position.y = 5
    sphere.position.z = 4

    scene.add(sphere)


    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);



    // let effect= new THREE.AsciiEffect(renderer,'  l^u*h*u$a@n');
    // effect.setSize( window.innerWidth, window.innerHeight)
    //@ts-ignore
    document.getElementById("WebGL-output").append(renderer.domElement);
    renderer.render(scene, camera);

  })


</script>

<style lang="scss" scoped>
#WebGL-output{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

</style>
