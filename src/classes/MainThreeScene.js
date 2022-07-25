import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI' 

import Pillard from './Pillard'
import Floor from './Floor'
import Spectrum from './Spectrum'
import ParticleSystem from './ParticleSystem'
import CamParallax from './CamParallax'
import SoundReactor from './SoundReactor'

class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls

        this.raycaster
        this.pointer
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        container.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        const bgColor = new THREE.Color(0x160017)
        const fog = new THREE.Fog(bgColor, 15, 30)
        this.scene = new THREE.Scene()
        this.scene.fog = fog
        this.scene.background = bgColor

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 6)
        this.camera.up = new THREE.Vector3( 0, 0, 0 );
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = config.controls
        // this.controls.enabled = false
        this.controls.maxDistance = 35
        this.controls.minDistance = 3
        this.controls.minPolarAngle = 0
        this.controls.maxPolarAngle = Math.Pi / 2 + 0.3

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        //DUMMY CUBE + SIMPLE GLSL SHADER LINKAGE
        // const shaderMat = new THREE.ShaderMaterial({
        //     vertexShader: simpleVert,
        //     fragmentShader: simpleFrag,
        // })
        // const cube = new THREE.Mesh(new THREE.BoxGeometry(), shaderMat)
        // this.scene.add(cube)

        CamParallax.init(this.camera)
        Pillard.init(this.scene, this.camera, this.pointer, this.raycaster);
        Floor.init(this.scene);
        Spectrum.init(this.scene);
        ParticleSystem.init(this.scene);

        MyGUI.hide()
        if (config.myGui)
            MyGUI.show()

        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        document.addEventListener( 'pointermove', event => {
            this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        })
        RAF.subscribe('threeSceneUpdate', this.update)
    } 

    update() { 
        this.renderer.render(this.scene, this.camera);
        if(SoundReactor.isPlaying) {
            this.camera.up = new THREE.Vector3( 0, 1, 0 ); 
            this.scene.rotateY(0.005)
        } else { 
            this.scene.rotateY(0.002)
        }
        Pillard.update();
        Spectrum.update();
        ParticleSystem.update();
        CamParallax.update();
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance