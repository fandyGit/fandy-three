<template>
  <div id="Stats-output"></div>
  <div id="WebGL-output"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  let stats = initStats()
  function initStats() {
    //@ts-ignore
    let stats = new Stats()
    stats.setMode(0)

    stats.domElement.position = 'absolute'
    stats.domElement.left = '0px'
    stats.domElement.top = '0px'

    //@ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
  }
  let scene = new THREE.Scene()

  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -40
  camera.position.y = 30
  camera.position.z = 30
  camera.lookAt(new THREE.Vector3(-10,3,3))

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true

  let ambientLight = new THREE.AmbientLight(0x090909)
  scene.add(ambientLight)

  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40,30,10)
  spotLight.castShadow = true
  scene.add(spotLight)

  let planeGeometry = new THREE.PlaneGeometry(60,40,1,1)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0x767687})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)

  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0

  plane.receiveShadow = true
  scene.add(plane)


  addGeometries(scene);

  function addGeometries(scene:any) {
    let geoms = []
    geoms.push(new THREE.CylinderGeometry(1,4,4))
    geoms.push(new THREE.BoxGeometry(2,2,2))
    geoms.push(new THREE.SphereGeometry(2))
    geoms.push(new THREE.IcosahedronGeometry(2))
    var points = [
      new THREE.Vector3(2,2,2),
      new THREE.Vector3(2,2,-2),
      new THREE.Vector3(2,-2,2),
      new THREE.Vector3(2,-2,-2),
      new THREE.Vector3(-2,2,2),
      new THREE.Vector3(-2,2,-2),
      new THREE.Vector3(-2,-2,2),
      new THREE.Vector3(-2,-2,-2),
    ];
    geoms.push(new THREE.ConvexGeometry(points));
    geoms.push(new THREE.OctahedronGeometry(3));
    geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));
    geoms.push(new THREE.TetrahedronGeometry(3));
    geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));
    geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));


    var j = 0;
    for (var i = 0; i < geoms.length; i++) {
      let cubeMaterial = new THREE.MeshLambertMaterial({wireframe:true,color: Math.random()*0xffffff})
      let materials = [
          new THREE.MeshLambertMaterial({color: Math.random()*0xffffff,shading: THREE.SmoothShading}),
          new THREE.MeshBasicMaterial({color:0x000000,wireframe: true})
      ]
      let mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i], materials);
      mesh.traverse(function (e: any) {
        e.castShadow = true
      })
      mesh.position.x = -24 + ((i % 4) * 12);
      mesh.position.y = 4;
      mesh.position.z = -8 + (j * 12);

      if ((i + 1) % 4 == 0) j++;
      scene.add(mesh)

    }

  }

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)

  renderScene()
  function renderScene() {

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
