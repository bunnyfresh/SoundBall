import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import SoundReactor from './SoundReactor'
import LoadingController from './LoadingController'

class Pillard {
    constructor() {
        this.bind()

        this.modelLoader = new GLTFLoader(LoadingController);
        this.textureLoader = new THREE.TextureLoader(LoadingController) 
    }

    init(scene, camera, pointer, raycaster) {
        this.scene = scene
        this.upVec = new THREE.Vector3(0, 1, 0)
        this.pillard
        this.pillards = new THREE.Group()
        this.pillardPositions
        this.pillardNeighbors = {}

        this.lockPillard
        this.lockPillardNeighbors = []
        
        this.mesh
        this.camera = camera
        this.pointer = pointer
        this.raycaster = raycaster 

        const gTexture = this.textureLoader.load('./assets/textures/grayMetal.png')
        const bTexture = this.textureLoader.load('./assets/textures/blackMetal.png')

        this.gMatCap = new THREE.MeshMatcapMaterial({
            matcap: gTexture
        })
        this.bMatCap = new THREE.MeshMatcapMaterial({
            matcap: bTexture
        })

        this.modelLoader.load('./assets/models/pillart.glb', (glb) => {
            console.log("glb" , glb)
            glb.scene.traverse(child => {
                switch(child.name) {
                    case 'base':
                        this.pillard = child 
                        break;
                    case 'circle':
                        child.material = this.bMatCap
                        break;
                    case 'cylinder':
                        child.material = this.gMatCap
                        break;
                }
            })
            
            this.computePosition()
        })
    }

    computePosition() {
        const spehereGeom = new THREE.IcosahedronGeometry(2, 4)
        const sphereMaterial = this.gMatCap;

        const sphere = new THREE.Mesh(spehereGeom, sphereMaterial)
        // const sphere = new THREE.Mesh(spehereGeom, new THREE.MeshNormalMaterial({
        //     wireframe: true
        // }))

        const sphereArray = sphere.geometry.attributes.position.array;
        const pillardPositions = []
        for (let i = 0; i < sphereArray.length; i += 3) {
            const x = sphereArray[i]
            const y = sphereArray[i + 1]
            const z = sphereArray[i + 2]

            const coordinates = {x, y, z}

            if(pillardPositions.findIndex(coord => { return coord.x == x && coord.y == y && coord.z == z}) == -1) {
                pillardPositions.push(coordinates)
                const c = this.pillard.clone()
                const posVec = new THREE.Vector3(coordinates.x , coordinates.y, coordinates.z)
                
                c.position.copy(posVec)
                c.scale.multiplyScalar(.26)
                c.quaternion.setFromUnitVectors(this.upVec, posVec.normalize())
                c.children[0].userData = {index: (pillardPositions.length - 1)}
                
                this.pillards.add(c)
            }    
        }

        this.pillardPositions = pillardPositions

        for (let i = 0; i < pillardPositions.length - 1; i++) 
            for (let j = i + 1; j < pillardPositions.length; j++) {
                if(
                    new THREE.Vector3(
                        pillardPositions[i].x, 
                        pillardPositions[i].y, 
                        pillardPositions[i].z)
                    .distanceTo(
                        new THREE.Vector3(
                            pillardPositions[j].x, 
                            pillardPositions[j].y, 
                            pillardPositions[j].z)
                    ) < 0.6) {
                        if (!this.pillardNeighbors[i]) {
                            this.pillardNeighbors[i] = [j]
                        } else {
                            this.pillardNeighbors[i] = [...this.pillardNeighbors[i], j]
                        }

                        if (!this.pillardNeighbors[j]) {
                            this.pillardNeighbors[j] = [i]
                        } else {
                            this.pillardNeighbors[j] = [...this.pillardNeighbors[j], i]
                        }
                    }   
              
            }

            // console.log(this.pillardNeighbors)        
        
        this.scene.add(this.pillards)
        this.scene.add(sphere) 
    } 

    update() { 
        let i = 0;
 
        if (SoundReactor.isPlaying) {
            while (i < this.pillards.children.length) {
                const y = ((SoundReactor.fdata[i] / 255) * 3) - 1.2
                this.pillards.children[i].children[0].position.lerp(new THREE.Vector3(0,y,0), 0.5) 
                i++
            }
        } else { 
            while (i < this.pillards.children.length) {
                if((!this.lockPillard || this.lockPillard.id !== this.pillards.children[i].children[0].id) &&
                    !this.lockPillardNeighbors.includes(this.pillards.children[i].children[0].userData.index)) {
                    const y = (Math.sin(Date.now() * 0.01 + this.pillards.children[i].position.x))
                    this.pillards.children[i].children[0].position.lerp(new THREE.Vector3(0,y,0), 0.5) 
                    this.pillards.children[i].children[0].scale.lerp(new THREE.Vector3(1,1,1), 0.1)
                }
                i++
            }
 
            this.hover();
        }
    }

    hover() {  
        this.raycaster.setFromCamera( this.pointer, this.camera )  
        const intersects = this.raycaster.intersectObject(this.pillards, true)
        if (intersects.length > 0) {
            const pillardObjects = intersects.filter(item => item.object.name === 'cylinder')
            
            if(pillardObjects.length > 0) {
                this.lockPillard = pillardObjects[0].object
                this.lockPillard.position.lerp(new THREE.Vector3(0,1.5,0), 0.1)
                this.lockPillard.scale.lerp(new THREE.Vector3(3,3,3), 0.1)
                this.lockPillardNeighbors = this.pillardNeighbors[this.lockPillard.userData.index]

                this.lockPillardNeighbors.forEach(item => { 
                    this.pillards.children[item].children[0].position.lerp(new THREE.Vector3(0,0.2,0), 0.1)
                    this.pillards.children[item].children[0].scale.lerp(new THREE.Vector3(2.6,2.6,2.6), 0.1)
                })
            } 
        } else { 
            this.lockPillard = null
            this.lockPillardNeighbors = []
        }
    }  

    bind() {

    }
}

const _instance = new Pillard()
export default _instance