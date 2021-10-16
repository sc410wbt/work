import * as THREE from "three"
import font from "../fonts/Montserrat_Bold.json"

let titleGroup = new THREE.Group()

export function removeTitle() {
	if (titleGroup.children.length > 0) {
		titleGroup.children[0].removeFromParent()
	}
}

export function addTitle(title) {
	let testFont = new THREE.Font(font)
	let textGeom = new THREE.TextGeometry(title.toUpperCase(), {
		font: testFont,
		size: 0.6,
		height: 0.05,
	})
	let text = new THREE.Mesh(textGeom, new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }))

	let measureBox = new THREE.Box3().setFromObject(text)
	let textWidth = Math.abs(measureBox.min.x - measureBox.max.x)
	text.position.set( -(textWidth/2), 0.1, 8.5)
	text.rotation.set(-Math.PI / 2, 0, 0)
	titleGroup.rotation.set(0, -0.3, 0)
	titleGroup.add(text)
}

export function addTitleGroupToStage(stage) {
	stage.add(titleGroup)
}
