// Construindo um sistema planetário.

import * as THREE from 'three';
import { GUI } 		from '../../Assets/scripts/three.js/examples/jsm/libs/lil-gui.module.min.js'

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
	renderer.render(scene, camera);
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

	// Sistema Solar
	var sistemaSolar = new THREE.Object3D();
	sistemaSolar.name = "Sistema Solar";

	// Eixo do Sol
	var sAxis = new THREE.AxesHelper(4.8);

	// Sol
	var sol = new THREE.Mesh 	( 	new THREE.SphereGeometry( 4.0, 20, 20), 
									new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} ) 
								);
	sol.name = "Sol";
	sol.add(sAxis);
	sistemaSolar.add(sol);	

	// Sistema terra-lua
	var sistemaTerraLua = new THREE.Object3D();
	sistemaTerraLua.name = "Sistema Terra-Lua";

	// Eixo da Terra
	var tAxis = new THREE.AxesHelper(1.2);

	// Terra
	var terra = new THREE.Mesh 	( 	new THREE.SphereGeometry( 1.0, 10, 10), 
									new THREE.MeshBasicMaterial( {color: 0x0000ff, wireframe:true} ) 
								);
	terra.name = "Terra";
	terra.add(tAxis);
	sistemaTerraLua.add(terra);	

	// Eixo da Lua
	var lAxis = new THREE.AxesHelper(0.6);

	// Lua
	var lua = new THREE.Mesh 	( 	new THREE.SphereGeometry( 0.5, 10, 10 ), 
									new THREE.MeshBasicMaterial( {color: 0xaaaaaa, wireframe:true} ) 
								);
	lua.name = "Lua";	
	lua.add(lAxis);
	sistemaTerraLua.add(lua);
	
	sistemaSolar.add(sistemaTerraLua);
	scene.add(sistemaSolar);
};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function animate() {

	let rotTerraLua	= 0.005;	// Rotação da Terra e da Lua ao redor do sol (Z)
	let rotTerra 	= 0.09;		// Rotação da Terra ao redor de seu eixo (Y)
	let rotLua 		= 0.01;		// Rotação da Lua ao redor do seu eixo (Y)

	var obj;

	if (controls.RotTerra) {
		obj = scene.getObjectByName("Terra");

		// Transformações para movimento da Terra aqui
		obj.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), rotTerra);
		obj.updateMatrix();
		}

	if (controls.RotLua) {
		obj = scene.getObjectByName("Lua");

		// Transformações para movimento da Lua aqui
		obj.rotateOnAxis(new THREE.Vector3(0.0, 1.0, 0.0), rotLua);
		var date = new Date();
		var time = date.getTime();
		obj.position.x = 2.0 * Math.cos(time/200);
		obj.position.z = 2.0 * Math.sin(time/200);
		
		obj.updateMatrix();
		}


	if (controls.RotTerraLua) {

		// Transformações para movimento do sistema Terra/Lua aqui
		obj = scene.getObjectByName("Sistema Terra-Lua");
		var date = new Date();
		var time = date.getTime();
		obj.position.x = 9.0 * Math.cos(time*rotTerraLua/10);
		obj.position.z = 9.0 * Math.sin(time*rotTerraLua/10);
		
		}	

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
