//I don't know how to code fire yet so I used a spinning texture. Have a laugh :P 

const scene = new THREE.Scene();

const url = 'https://assets.codepen.io/4332848/blueSwirl.png';

const spheres = [];

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

//Renderer
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Lighting
const ambientLight = new THREE.AmbientLight(0xd1d1b6, 1),
      pointLight = new THREE.PointLight(0xffffff, 2, 100, 2);
pointLight.castShadow = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.add(ambientLight);
pointLight.shadow.mapSize.width = 256; 
pointLight.shadow.mapSize.height = 256; 
pointLight.shadow.camera.near = 0.1; 
pointLight.shadow.camera.far = 10; 

//Object Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.update();

//Textures
const textureCube = new THREE.TextureLoader().load(url);
const moleTexture = new THREE.MeshPhongMaterial( { map: textureCube, opacity: 0.6, transparent: true, aoMapIntensity: 0.8}),
      
      textureBox = new THREE.MeshPhongMaterial({
        color: 0x7d83b3,
        opacity: 0.2,
        transparent: true,
        side: THREE.BackSide,
        receiveShadow: true,
        castShadow: false
}),
      
      black = new THREE.LineBasicMaterial({color: 0x000000}),
      fireURL = new THREE.TextureLoader().load('https://assets.codepen.io/4332848/PngItem_2135957.png'),
      fireTexture = new THREE.MeshBasicMaterial({map: fireURL, opacity: 0.5, transparent: true, aoMapIntensity: 0.01, side: THREE.DoubleSide}),
      lightTexture = new THREE.MeshPhongMaterial({color: 0x7d35f2}),
      shadowMap = new THREE.MeshDistanceMaterial({map: textureBox});
      
//Geometries
const box = new THREE.BoxGeometry(10.5,10.5,10.5),
      altGeo = new THREE.PlaneBufferGeometry(2,10,32),
      molecule = new THREE.SphereGeometry(0.1, 32, 32),
      boxWireFrame = new THREE.EdgesGeometry(box),
      cube = new THREE.Mesh(box, textureBox),
      fireGeo = new THREE.ConeGeometry(2, 10, 32),
      fire = new THREE.Mesh(altGeo, fireTexture),
      fire2 = new THREE.Mesh(altGeo, fireTexture),
      fire3 = new THREE.Mesh(altGeo, fireTexture),
      lightGeo = new THREE.SphereGeometry(0.01, 16, 16),
      lightParticle = new THREE.Mesh(lightGeo, lightTexture);
      lightParticle.add(pointLight);

cube.add(shadowMap);
cube.add(new THREE.LineSegments(boxWireFrame, black));
fire.position.y = -9;
fire.rotation.x = 6.3;
fire.rotation.y = 2;
fire2.position.y = -8.8;
fire2.position.x = -0.20;
fire2.rotation.x = 6.3;
fire3.position.y = -8.8;
fire3.position.x = 0.20;
fire3.rotation.x = 6;
lightParticle.position.y = 0;
scene.add(fire, fire2, fire3, cube, lightParticle);

//Load molecules
for (let i = 0; i < 200; i ++) {
  
					const mesh = new THREE.Mesh(molecule, moleTexture);

			mesh.position.x = Math.random() * 10 - 5;
			mesh.position.y = Math.random() * 10 - 5;
			mesh.position.z = Math.random() * 10 - 5;
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
      scene.add( mesh );
			spheres.push( mesh );
      spheres[i].receiveShadow = false;
      spheres[i].castShadow = true;
				}

//Options GUI setup 
const gui = new dat.GUI();

var options = {
  temp: 0.0008
};

var guiMenu = gui.addFolder('Options');
guiMenu.add(options, 'temp', 0.0005, 0.0020).name('Heat').listen();
guiMenu.open();

cube.add(new THREE.PointLight(0x0000ff, 1, 100, 2));
//Animation updater
var animate = function () {
  
  const time = options.temp * Date.now();
  
  for (let i = 0, length = spheres.length; i < length; i ++) {

			const sphere = spheres[i];

			sphere.position.x = 5 * Math.cos( time + i );
			sphere.position.y = 5 * Math.sin( time + i * 1.1 );
        
				}
  fire.rotation.y = 1.95*(Math.sin(time)/Math.cos(time))/0.02;
  fire.scale.y = time * 0.0000000003;
  fire2.rotation.y = fire.rotation.y - 2;
  fire2.scale.y = fire.scale.y - 0.000000001;
  fire3.rotation.y = fire.rotation.y -4;
  fire3.scale.y = fire.scale.y;
  fire.scale.x = time * 0.0000000006;
  fire2.scale.x = fire.scale.x;
  fire3.scale.x = fire.scale.x;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

animate();