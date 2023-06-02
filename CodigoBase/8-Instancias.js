// Instancias de objetos.

import * as THREE from 'three';
import { GUI } 		from '../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

const 	rendSize 	= new THREE.Vector2();

var 	gui 		= new GUI();

var 	scene,
		renderer,
		camera,
		controls;

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = 
	rendSize.y = Math.min(window.innerWidth, window.innerHeight) * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();

	camera = new THREE.OrthographicCamera( -12.0, 12.0, 12.0, -12.0, -12.0, 12.0 );
	scene.add( camera );

	initGUI();

	buildScene();

	renderer.clear();
	requestAnimationFrame(animate);
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function initGUI() {

	controls = 	{	RotLua 		: true,
					RotTerra 	: true,
					RotTerraLua : true,
					};

	gui.add( controls, 'RotLua');
	gui.add( controls, 'RotTerra');
	gui.add( controls, 'RotTerraLua');
	gui.open();
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function buildScene() {

	// Sistema Solar: Sol, Terra e Lua
	// 3 instancias de esferas 

	var sistemaSolar 		= new THREE.InstancedMesh( 	new THREE.SphereGeometry( 1.0, 10, 10), 
														new THREE.MeshBasicMaterial( {wireframe:false} ), 
														3 );
	sistemaSolar.name = "SistemaSolar";

	scene.add(sistemaSolar);

	const instanceColors 	= [ 0xffff00, 0x0000FF, 0xaaaaaa ];

	for (let i = 0 ; i < 3 ; i++) 
		sistemaSolar.setColorAt ( i, new THREE.Color(instanceColors[i]));
	
	// Sol
	var transfMat = new THREE.Matrix4().makeScale(4.0, 4.0, 4.0);
	sistemaSolar.setMatrixAt( 0, transfMat );

	// Terra
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(1.0, 1.0, 1.0));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(7.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 1, transfMat );

	// Lua
	transfMat.identity();
	transfMat.multiply(new THREE.Matrix4().makeScale(0.5, 0.5, 0.5));
	transfMat.multiply(new THREE.Matrix4().makeTranslation(18.0, 0.0, 0.0));
	sistemaSolar.setMatrixAt( 2, transfMat );

	sistemaSolar.needsUpdate = true;
	var mat = new THREE.Matrix4();
	sistemaSolar.getMatrixAt(1, mat)
	console.log(mat);
}

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate() {
	var date = new Date();
	var time = date.getTime();

	let rotTerraLua	= 0.0005 * time;		// Rotação da Terra e da Lua ao redor do sol (Z)
	let rotTerra 	= 0.001  * time;		// Rotação da Terra ao redor de seu eixo (Y)
	let rotLua 		= 0.005  * time;		// Rotação da Lua ao redor do seu eixo (Y)

var obj = scene.getObjectByName("SistemaSolar");

	// Terra
	if (controls.RotTerra) {

		// Transformações para o movimento da Terra aqui
		var matSol = new THREE.Matrix4();
		obj.getMatrixAt(0, matSol);
		var solX = matSol.elements[12];
		var solY = matSol.elements[13];
		var solZ = matSol.elements[14];

		var matTransTerra = new THREE.Matrix4().makeTranslation(7.0 * Math.sin(rotTerra), 0.0, 7.0 * Math.cos(rotTerra));
		var matRotTerra = new THREE.Matrix4().makeRotationY((Math.PI/180) * 0.005);
		var matTerra = new THREE.Matrix4();
		obj.getMatrixAt(1, matTerra);
		matTerra.setPosition(new THREE.Vector3(solX, solY, solZ));
		obj.setMatrixAt(1, matTerra.multiply(matTransTerra).multiply(matRotTerra));	
		//obj.position.x = 2.0 * Math.cos(time/1000);
		//obj.position.z = 2.0 * Math.sin(time/1000);
	}
		
	// Lua
	if (controls.RotLua) {

		// Transformações para o movimento da Lua aqui
		var matTerra = new THREE.Matrix4();
		obj.getMatrixAt(1, matTerra);
		var terraX = matTerra.elements[12];
		var terraY = matTerra.elements[13];
		var terraZ = matTerra.elements[14];
		
		var matTransLua = new THREE.Matrix4().makeTranslation(3.0 * Math.sin(rotLua), 0.0, 3.0 * Math.cos(rotLua));
		var matRotLua = new THREE.Matrix4().makeRotationY((Math.PI/180) * 0.005);
		var matLua = new THREE.Matrix4();
		obj.getMatrixAt(2, matLua);
		matLua.setPosition(new THREE.Vector3(terraX, terraY, terraZ));
		obj.setMatrixAt(2, matLua.multiply(matTransLua).multiply(matRotLua));
		
		
		}

	// Como controlar o sistema Terra/Lua ?
	if (controls.RotTerraLua) {

		// Transformações para o movimento da Terra e Lua aqui
		
		}

	obj.instanceMatrix.needsUpdate = true;

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
