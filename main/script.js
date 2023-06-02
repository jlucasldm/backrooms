/*
TODO:
- [ ] Animar modelos
*/
// Importando Three.js
import * as THREE from 'three';

// Importando módulo para controle de entrada de parâmetros (GUI)
import { GUI } from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

// Importando módulos para controle de câmera
import { OrbitControls } from '../../Assets/scripts/three.js/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from '../../Assets/scripts/three.js/examples/jsm/controls/FirstPersonControls.js';
import { FlyControls } from '../../Assets/scripts/three.js/examples/jsm/controls/FlyControls.js';

// Importando módulos para carregamento de modelos
import { GLTFLoader } from '../Assets/scripts/three.js/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from '../Assets/scripts/three.js/examples/jsm/loaders/FBXLoader.js';
import * as SkeletonUtils from '../Assets/scripts/three.js/examples/jsm/utils/SkeletonUtils.js';

// Configurando as variáveis globais
var scene,
	renderer,
	cameraExterna,
	cameraInterna,
	cameraGuiada1,
	cameraGuiada2,
	cameraGuiada3,
	controls,
	camOrbitControl,
	camFirstPersonControl,
	camFlyControl1,
	camFlyControl2,
	camFlyControl3;

// Instancializando o objeto GUI
var gui = new GUI();

// Configurando as variáveis de luz para as luzes pontuais
var lightColor = 0xffffff;
var lightIntensity = 0.5;
var lightDistance = 9.5;
var posy = 3.0;

// Configurando as posições das luzes pontuais, de acordo com os pontos de luz do cenário
var camerasPos = [['i1', 'j1'], ['i4', 'j1'], ['i7', 'j1'], ['i10', 'j1'], ['i14', 'j1'],
['i1', 'j2'], ['i15', 'j2'],
['i3', 'j3'], ['i7', 'j3'], ['i11', 'j3'],
['i5', 'j4'], ['i9', 'j4'], ['i13', 'j4'],
['i14', 'j5'],
['i6', 'j6'], ['i12', 'j6'],
['i9', 'j7'], ['i15', 'j7'],
['i1', 'j8'], ['i4', 'j8'],
['i14', 'j9'],
['i2', 'j10'], ['i5', 'j10'], ['i8', 'j10'], ['i12', 'j10'],
['i3', 'j11'], ['i6', 'j11'], ['i10', 'j11'], ['i14', 'j11'],
['i1', 'j12'], ['i5', 'j12'], ['i8', 'j12'], ['i12', 'j12'], ['i15', 'j12']];
var coordI = {
	'i1': -11.5, 'i2': -10.0, 'i3': -8.3, 'i4': -6.5, 'i5': -5.0, 'i6': -3.5, 'i7': -1.5,
	'i8': 0.0, 'i9': 1.5, 'i10': 3.5, 'i11': 4.7, 'i12': 6.5, 'i13': 8.0, 'i14': 9.5, 'i15': 11.5
};
var coordJ = {
	'j1': -10.5, 'j2': -7.5, 'j3': -5.5, 'j4': -4.0, 'j5': -2.5, 'j6': -1.0, 'j7': 0.5, 'j8': 2.0,
	'j9': 3.5, 'j10': 5.0, 'j11': 8.0, 'j12': 11.5
};

const rendSize = new THREE.Vector2();
const clock = new THREE.Clock();


/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function main() {

	// Criando e instancializando o renderer no documento HTML
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	rendSize.x = window.innerWidth * 0.9999;
	rendSize.y = window.innerHeight * 0.9999;
	renderer.setSize(rendSize.x, rendSize.y);
	document.body.appendChild(renderer.domElement);

	// Criando e instancializando a cena e as câmeras
	scene = new THREE.Scene();
	cameraExterna = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 500.0);
	cameraInterna = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 500.0);
	cameraGuiada1 = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 500.0);
	cameraGuiada2 = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 500.0);
	cameraGuiada3 = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.01, 500.0);
	cameraGuiada1.lookAt(30.0, 0.0, 5.0);
	cameraGuiada2.lookAt(-30.0, 0.0, 5.0);
	cameraGuiada3.lookAt(0.0, 0.0, 30.0);

	// Adicionando luzes pontuais no modelo, simulando as lâmpadas do cenário
	for (let i = 0; i < camerasPos.length; i++) {
		console.log(camerasPos[i][0], coordI[camerasPos[i][0]]);
		var pointLight = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
		pointLight.position.set(coordI[camerasPos[i][0]], posy, coordJ[camerasPos[i][1]]);
		scene.add(pointLight);
	}

	// Carregando o modelo do Backrooms
	const loaderGltf = new GLTFLoader();
	loaderGltf.load('./assets/backrooms/scene.gltf', function (gltf) {
		gltf.scene.scale.set(1.0, 1.0, 1.0);
		gltf.scene.name = "backrooms";
		scene.add(gltf.scene);
		ajusteCamera();
	})

	// Carregando o primeiro modelo do Cientista
	loaderGltf.load('./assets/doctors/scene.gltf', function (gltf) {
		gltf.scene.scale.set(0.027, 0.027, 0.027);
		gltf.scene.position.x = 8.0;
		gltf.scene.position.y = 0.1;
		gltf.scene.position.z = -3.3;
		gltf.scene.name = "doctor";

		scene.add(gltf.scene);
		ajusteCamera();
	});

	// Carregando o segundo modelo do Cientista
	loaderGltf.load('./assets/doctors/scene.gltf', function (gltf) {
		gltf.scene.scale.set(0.027, 0.027, 0.027);
		gltf.scene.position.x = -11.0;
		gltf.scene.position.y = 0.1;
		gltf.scene.position.z = 12.0;
		gltf.scene.rotation.y = Math.PI / 1.5;
		gltf.scene.name = "doctor";

		scene.add(gltf.scene);
		ajusteCamera();
	});

	// Carregando o modelo da Coisa
	loaderGltf.load('./assets/thing/scene.gltf', function (gltf) {
		gltf.scene.scale.set(0.5, 0.5, 0.5);
		gltf.scene.name = "thing";
		gltf.scene.position.x = -13.0;
		gltf.scene.position.y = 0.1;
		gltf.scene.position.z = -1.0;
		gltf.scene.rotation.y = (Math.PI / 2.0) + 0.9;
		scene.add(gltf.scene);
		ajusteCamera();
	});

	// Configuranção do controle de câmera First Person, usada na visita interna
	camFirstPersonControl = new FirstPersonControls(cameraInterna, renderer.domElement);
	camFirstPersonControl.lookSpeed = 0.5;
	camFirstPersonControl.movementSpeed = 10;
	camFirstPersonControl.activeLook = false;
	cameraInterna.position.x = 0.0;
	cameraInterna.position.y = 1.8;
	cameraInterna.position.z = 0.0;
	camFirstPersonControl.target = new THREE.Vector3(0.0, 1.8, 0.0);

	// Configuranção do controle de câmera Orbit, usada na visita externa
	camOrbitControl = new OrbitControls(cameraExterna, renderer.domElement);
	cameraExterna.position.x = 0.0;
	cameraExterna.position.y = 25.0;
	cameraExterna.position.z = 35.0;
	camOrbitControl.target = new THREE.Vector3(0.0, 0.0, 0.0);

	// Configuranção do controle de câmera Fly 1, usada na visita guiada
	camFlyControl1 = new FlyControls(cameraGuiada1, renderer.domElement);
	camFlyControl1.movementSpeed = 0.0;
	camFlyControl1.rollSpeed = 0.0;
	camFlyControl1.autoForward = false;
	camFlyControl1.dragToLook = false;
	cameraGuiada1.position.x = 0.0;
	cameraGuiada1.position.y = 1.8;
	cameraGuiada1.position.z = -4.8;

	// Configuranção do controle de câmera Fly 2, usada na visita guiada
	camFlyControl2 = new FlyControls(cameraGuiada2, renderer.domElement);
	camFlyControl2.movementSpeed = 0.0;
	camFlyControl2.rollSpeed = 0.0;
	camFlyControl2.autoForward = false;
	camFlyControl2.dragToLook = false;
	cameraGuiada2.position.x = -12.0;
	cameraGuiada2.position.y = 1.8;
	cameraGuiada2.position.z = 11.3;
	cameraGuiada2.rotation.y = Math.PI * -0.4;

	// Configuranção do controle de câmera Fly 2, usada na visita guiada
	camFlyControl3 = new FlyControls(cameraGuiada3, renderer.domElement);
	camFlyControl3.movementSpeed = 0.0;
	camFlyControl3.rollSpeed = 0.0;
	camFlyControl3.autoForward = false;
	camFlyControl3.dragToLook = false;
	cameraGuiada3.position.x = -5.0;
	cameraGuiada3.position.y = 1.8;
	cameraGuiada3.position.z = -8.0;
	cameraGuiada3.rotation.y = 1.0;

	// Inicializando a GUI
	initGUI();

	// Chamando a função de renderização
	render();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************
function ajusteCamera() {

	var obj = scene.getObjectByName("backrooms");

	const helper = new THREE.BoxHelper();
	helper.setFromObject(obj);
	helper.geometry.computeBoundingBox();

	const box = new THREE.Box3().setFromObject(obj);
	var farPlane = Math.max(box.max.x, box.max.y, box.max.z);

	cameraInterna.far = farPlane * 10.0;
	cameraInterna.updateProjectionMatrix();

	cameraExterna.far = farPlane * 10.0;
	cameraExterna.updateProjectionMatrix();
	camOrbitControl.autoRotate = controls.rotacaoAutomatica;
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************
function render() {

	// Configurando os planos de corte
	var xyPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), controls.alcanceCorte);
	var xzPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), controls.alcanceCorte);
	var yzPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), controls.alcanceCorte);
	var globalPlane = new THREE.Plane(new THREE.Vector3(0, 0, 0), 1);

	// Configurando o plano de corte de acordo com a seleção do usuário. Inicialmente, o plano de corte é o plano global
	var plane = globalPlane;

	// Configurando a câmera de acordo com a seleção do usuário
	if (controls.tipoVisita == 'Externa') {

		// Se o ponto de luz direcional Sun não estiver definida, define-a
		if (scene.getObjectByName('sun') == null) {
			var sun = new THREE.DirectionalLight(0xffffff, 0.5);
			sun.castShadow = false;
			sun.position.set(0, 5, 0);
			sun.name = 'sun';
			scene.add(sun);
		}

		// Se a luz ambiente Ambient não estiver definida, define-a
		if (scene.getObjectByName('ambient') == null) {
			var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
			ambientLight.castShadow = true;
			ambientLight.name = 'ambient';
			scene.add(ambientLight);
		}

		// Configurando o plano de corte de acordo com a seleção do usuário
		if (controls.cortePlano == 'Plano XY') {
			plane = xyPlane;
		} else if (controls.cortePlano == 'Plano XZ') {
			plane = xzPlane;
		} else if (controls.cortePlano == 'Plano YZ') {
			plane = yzPlane;
		} else {
			plane = globalPlane;
		}

		camOrbitControl.update(clock.getDelta());
		renderer.render(scene, cameraExterna);

	} else if (controls.tipoVisita == 'Interna') {

		// Removendo os pontos de luz direcional Sun e a luz ambiente Ambient
		if (scene.getObjectByName('sun') != null) {
			scene.remove(scene.getObjectByName('sun'));
		}

		if (scene.getObjectByName('ambient') != null) {
			scene.remove(scene.getObjectByName('ambient'));
		}

		// Configurando o comportamento da câmera de acordo com a tecla pressionada
		document.body.onkeyup = function (e) {
			if (e.key == " " || e.code == "Spacebar") {
				camFirstPersonControl.activeLook = !camFirstPersonControl.activeLook;
			}
		}

		// Limitando o movimento da câmera para dentro do modelo
		if (cameraInterna.position.x < -12.0) cameraInterna.position.x = -12.0;
		if (cameraInterna.position.x > 12.0) cameraInterna.position.x = 12.0;
		if (cameraInterna.position.z < -12.0) cameraInterna.position.z = -12.0;
		if (cameraInterna.position.z > 12.0) cameraInterna.position.z = 12.0;

		camFirstPersonControl.update(clock.getDelta());
		cameraInterna.position.y = 1.8;
		renderer.render(scene, cameraInterna);
	} else {

		// Removendo os pontos de luz direcional Sun e a luz ambiente Ambient
		if (scene.getObjectByName('sun') != null) {
			scene.remove(scene.getObjectByName('sun'));
		}

		if (scene.getObjectByName('ambient') != null) {
			scene.remove(scene.getObjectByName('ambient'));
		}

		// Renderizando a cena de acordo com a câmera selecionada
		if (controls.visitaGuiadaCamera == '1') {
			camFlyControl1.update(clock.getDelta());
			renderer.render(scene, cameraGuiada1);
		} else if (controls.visitaGuiadaCamera == '2') {
			camFlyControl2.update(clock.getDelta());
			renderer.render(scene, cameraGuiada2);
		} else {
			camFlyControl3.update(clock.getDelta());
			renderer.render(scene, cameraGuiada3);
		}
	}

	// Cortando o modelo de acordo com o plano de corte selecionado
	renderer.clippingPlanes = [plane];
	renderer.localClippingEnabled = true;

	window.addEventListener('resize', function () {
		rendSize.x = window.innerWidth * 0.9999;
		rendSize.y = window.innerHeight * 0.9999;
		renderer.setSize(rendSize.x, rendSize.y);
	});

	requestAnimationFrame(render);
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************


function initGUI() {

	// Configurando os controles da GUI
	controls = {
		tipoVisita: 'Interna',
		visitaGuiadaCamera: '1',
		cortePlano: 'Nenhum',
		alcanceCorte: 0.1,
		rotacaoAutomatica: true,
	};

	// Adicionando os controles da GUI
	gui.add(controls, 'tipoVisita', ['Interna', 'Externa', 'Guiada']).onChange(ajusteCamera);
	gui.add(controls, 'visitaGuiadaCamera', ['1', '2', '3']).onChange(ajusteCamera);
	gui.add(controls, 'cortePlano', ['Nenhum', 'Plano XY', 'Plano XZ', 'Plano YZ']).onChange(ajusteCamera);
	gui.add(controls, 'alcanceCorte', -17.0, 17.0).onChange(ajusteCamera);
	gui.add(controls, 'rotacaoAutomatica').onChange(ajusteCamera);

	// Abrindo a GUI
	gui.open();
};

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
