import * as THREE from 'three'
import { makeTextSprite } from './textLabel'

export class M extends THREE.Group {
    constructor() {
        super()

        this._g = new THREE.BoxGeometry(.03, .03, .03)
        //this.add(this._createMesh())

        this._drawLineBasic()
        this._drawLineAngle()
        this._drawLineBySegment()
    }

    /**
     * Ax + By + C = 0
     */
    _drawLineBasic () {
        const mat = this._createMaterial(0xff0000)

        const A = 1.5
        const B = 2
        const C = -3

        for (let i = -25; i < 25; ++i) {
            const x = i * .3
            const z = (-A * x - C) / B

            this._makePoint(i, x, 0, z, mat)
        }
    }

    /**
     * y = kx + b; k = tg(alpha)
     */
    _drawLineAngle () {
        const mat = this._createMaterial(0x00ff00)

        const alpha = Math.PI * 0.333
        const tg = Math.tan(alpha)
        const b = -3

        for (let i = -25; i < 25; ++i) {
            const x = i * .3
            const z = tg * x + b

            this._makePoint(i, x, 0, z, mat)
        }
    }

    /**
     * x/xx + y/yy = 1
     */
    _drawLineBySegment () {
        const mat = this._createMaterial(0x000000)

        const xx = 5
        const yy = 1

        for (let i = -25; i < 25; ++i) {
            const x = i * .3
            const z = yy * (1 - x / xx)

            this._makePoint(i, x, 0, z, mat)
        }
    }







    /** **********************************/

    _makePoint(i, x, y, z, mat) {
        const m = this._createMesh(mat)
        m.position.set(x, 0, z)
        this.add(m)

        const s = makeTextSprite(`${ i }| x: ${ x.toFixed(2) }, z: ${ z.toFixed(2) }`)
        m.add(s)
    }


    _createMaterial (color) {
        return new THREE.MeshBasicMaterial({ color })
    }

    _createMesh (m) {
        return new THREE.Mesh(this._g, m)
    }
}
