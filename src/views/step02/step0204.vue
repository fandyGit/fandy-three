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
    stats.domElement.right = '0px'
    //@ts-ignore
    document.getElementById('Stats-output').append(stats.domElement)
    return stats
  }
  let scene = new THREE.Scene()

  let camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000)
  camera.position.x = -30
  camera.position.y = 20
  camera.position.z = 30
  camera.lookAt(new THREE.Vector3(10,0,0))

  let renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0))
  renderer.setSize(window.innerWidth,window.innerHeight)
  renderer.shadowMapEnabled = true

  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40, 60, 10);
  spotLight.castShadow = true
  scene.add(spotLight)

  // let ambientLight = new THREE.AmbientLight(0x456556)
  // scene.add(ambientLight)

  let planeGeometry = new THREE.PlaneGeometry(60,30,1,1)
  let planeMaterial = new THREE.MeshLambertMaterial({color:0xffffff})
  let plane = new THREE.Mesh(planeGeometry,planeMaterial)
  plane.receiveShadow = true

  plane.rotation.x = -0.5*Math.PI
  plane.position.x = 4
  plane.position.y = 0
  plane.position.z = 0

  scene.add(plane)

  //
  let vertices = [
      new THREE.Vector3(4, 4, 4),//右前上  0
      new THREE.Vector3(4, 0, 4),//右前下  1
      new THREE.Vector3(4, 4, 0),//右后上  2
      new THREE.Vector3(4, 0, 0),//右后下 3
      new THREE.Vector3(0, 4, 4), //左前上 4
      new THREE.Vector3(0, 0, 4),//左前下 5
      new THREE.Vector3(0, 4, 0),//左后上 6
      new THREE.Vector3(0, 0, 0),//左后下 7
  ]
  let faces = [
      new THREE.Face3(0, 1, 2),
      new THREE.Face3(2, 1, 3),
      new THREE.Face3(0, 1, 4),
      new THREE.Face3(4, 5, 1),
      new THREE.Face3(2, 3, 6),
      new THREE.Face3(7, 3, 6),
      new THREE.Face3(4, 5, 6),
      new THREE.Face3(7, 5, 6),
      new THREE.Face3(0, 6, 4),
      new THREE.Face3(0, 6, 2),
      new THREE.Face3(1, 7, 5),
      new THREE.Face3(1, 7, 2),
  ]

  let geom = new THREE.Geometry()
  geom.vertices = vertices
  geom.faces = faces
  geom.computeFaceNormals()

  let materials = [
      new THREE.MeshLambertMaterial({color:0x44ff44,opacity:0.8,transparent: true}),
      new THREE.MeshBasicMaterial({color:0x000000,wireframe:true})
  ]
  let mesh = new THREE.SceneUtils.createMultiMaterialObject(geom,materials)

  mesh.children.forEach((e:any) => {
    e.castShadow =true
  })

  scene.add(mesh)

  //@ts-ignore
  document.getElementById('WebGL-output').append(renderer.domElement)

  function addControl( x:number,y:number,z:number) {
    //@ts-ignore
    var controls = new function() {
      //@ts-ignore
      this.x = x
      //@ts-ignore
      this.y = y
      //@ts-ignore
      this.z = z
    }
    return controls
  }
  let controlPoints:any = []
  controlPoints.push(addControl(3, 5, 3));
  controlPoints.push(addControl(3, 5, 0));
  controlPoints.push(addControl(3, 0, 3));
  controlPoints.push(addControl(3, 0, 0));
  controlPoints.push(addControl(0, 5, 0));
  controlPoints.push(addControl(0, 5, 3));
  controlPoints.push(addControl(0, 0, 0));
  controlPoints.push(addControl(0, 0, 3));
  let gui = new dat.GUI()
  //@ts-ignore
  gui.add(new function (){
    //@ts-ignore
    this.clone = function () {
        let cloneGeometry = mesh.children[0].geometry.clone()
        let material = [
          new THREE.MeshLambertMaterial({color:0x44ff44,opacity:0.8,transparent: true}),
          new THREE.MeshBasicMaterial({color:0x000000,wireframe:true})
        ]
        let mesh2 = new THREE.SceneUtils.createMultiMaterialObject(cloneGeometry,material)
        mesh2.children.forEach((e:any) => {
          e.castShadow =true
        })
      mesh2.translateX(5)
      mesh2.translateZ(5)
      mesh2.name = 'clone'
      scene.remove(scene.getChildByName('clone'))
      scene.add(mesh2)
    }
  },'clone')

  for (var i = 0; i < controlPoints.length; i++) {

    var f1 = gui.addFolder('Vertices ' + (i + 1));
    f1.add(controlPoints[i], 'x', -10, 10);
    f1.add(controlPoints[i], 'y', -10, 10);
    f1.add(controlPoints[i], 'z', -10, 10);

  }

  renderScene()
  function renderScene() {
    stats.update();

    let vertices:any = [];
    for (var i = 0; i < 8; i++) {
      vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
    }

    mesh.children.forEach(function (e:any) {
      e.geometry.vertices = vertices;
      e.geometry.verticesNeedUpdate = true;
      e.geometry.computeFaceNormals();
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
