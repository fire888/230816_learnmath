import { createStudio } from './Entities/Studio'
import { Land } from "./Entities/Land"
import { CameraOrbit } from "./Entities/CameraOrbit"
import * as TWEEN from "@tweenjs/tween.js"
import { M } from './Entities/CustomObject/mesh'


async function runApplication () {
    const studio = createStudio()

    const land = new Land()
    studio.addToScene(land)

    const m = new M()
    studio.addToScene(m)

    const gridHelper = new THREE.GridHelper( 100, 100 );
    studio.addToScene( gridHelper );

    const cameraOrbit = new CameraOrbit(studio.renderer)
    studio.setCamera(cameraOrbit)

    const animate = () => {
        requestAnimationFrame( animate )
        TWEEN.update()
        studio.render()
    }
    animate()

    const onWindowResize = () => {
        studio.resize()
    }
    window.addEventListener('resize', onWindowResize, false)
    onWindowResize()
}

window.addEventListener('load', runApplication)

