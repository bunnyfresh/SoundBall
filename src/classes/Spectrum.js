import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import fragmentShader from '../shaders/fragmentShader.frag'
import vertexShader from '../shaders/vertexShader.vert'
import LoadingController from './LoadingController'

class Spectrum {
    constructor() {
        this.bind()

        this.modelLoader = new GLTFLoader(LoadingController);
        this.textureLoader = new THREE.TextureLoader(LoadingController)
    }

    init(scene) {
        this.scene = scene
        this.spectrum
        
        this.uniform = {
            uMatCap: {
                value: this.textureLoader.load('assets/textures/blackMetal.png')
            },
            uSpecterSize: {
                value: .6
            },
            uTime: {
                value: 0
            },
            uWaveBorder: {
                value: 0.1
            },
            uBorderColor: {
                value: new THREE.Color("hsl(345, 80%, 63%)")
            }
        }

        this.shaderMatirial = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: this.uniform,
            transparent: true
        })
        
        this.modelLoader.load('./assets/models/spectrum.glb', (glb) => { 
            glb.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    this.spectrum = child
                }
            })
            this.spectrum.material = this.shaderMatirial
            this.spectrum.translateY(-0.1)
            this.spectrum.scale.multiplyScalar(2)
            this.scene.add(glb.scene)
        })

    }

    update() {
        this.uniform.uTime.value += 1
    }

    bind() {

    }
}

const _instance = new Spectrum()
export default _instance