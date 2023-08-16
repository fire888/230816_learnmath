import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as TWEEN from '@tweenjs/tween.js'


export class CameraOrbit extends THREE.PerspectiveCamera {
    constructor (renderer) {
        super(45, window.innerWidth / window.innerHeight, 0.01, 100000)

        this.position.set(0, 10, -10)
        if (!renderer) {
            console.log('!!!: no renderer for orbitControls')
        }
        this._controls = new OrbitControls(this, renderer.domElement)
        this._controls.minDistance = 0
        this._controls.maxDistance = 200
        this._controls.maxPolarAngle = Math.PI / 2 - 0.01
        this._controls.zoomSpeed = 1
        this._controls.target.set(0, 0, 0)
        this._controls.update()
        this.target = this._controls.target

        this._savedCamPos = null
        this._savedTargetPos = null

        document.addEventListener("keydown", (event) => {
            if (event.code === 'KeyX') {
                console.log(`camPos: [${this.position.toArray()}], targetPos: [${this._controls.target.toArray()}]`)
            }
        });
    }

    update () {
        this._controls.update()
    }

    flyToFloorView (key) {
        if (!FLOOR_VIEWS[key]) {
            console.log('no view key:', key)
        }
        this._flyTo(FLOOR_VIEWS[key].camPos, FLOOR_VIEWS[key].targetPos)
    }

    flyToObject (obj, fov) {
        this._savedCamPos = this.position.toArray()
        this._savedTargetPos = this._controls.target.toArray()

        const obj3D = new THREE.Object3D()
        const v = new THREE.Vector3()
        const q = new THREE.Quaternion()

        obj.getWorldPosition(v)
        obj.getWorldQuaternion(q)

        obj3D.position.copy(v)
        obj3D.quaternion.copy(q)
        obj3D.translateZ(-5)

        const targetPos = obj3D.position.toArray()
        const camPos = v.toArray()

        this._flyTo(camPos, targetPos, fov)
    }

    flyFromObjectToSavedPos (obj) {
        const obj3D = new THREE.Object3D()
        const v3 = new THREE.Vector3()
        const q = new THREE.Quaternion()

        obj.getWorldPosition(v3)
        obj.getWorldQuaternion(q)

        this.position.copy(v3)
        obj3D.position.copy(v3)
        obj3D.quaternion.copy(q)
        obj3D.translateZ(-5)
        this.target.copy(obj3D.position)

        this._flyTo(this._savedCamPos, this._savedTargetPos)
    }

    _flyTo (camPos, targetPos, fov = 45) {
        const data = {
            camPos: this.position.toArray(),
            targetPos: this._controls.target.toArray(),
            fov: this.fov,
        }

        new TWEEN.Tween(data)
            .to({ camPos, targetPos, fov,}, 1000)
            .onUpdate(() => {
                this.position.fromArray(data.camPos)
                this.target.fromArray(data.targetPos)
                this.fov = data.fov
                this.updateProjectionMatrix()
            })
            .start()
    }
}
