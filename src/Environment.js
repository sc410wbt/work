import React, {useEffect} from 'react'
import {useSelector} from "react-redux"
import * as THREE from 'three'
import {Geometry} from "three/examples/jsm/deprecated/Geometry";
import * as TWEEN from 'tween'
// import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

import formulateSprites from "./library/Loader"


import s from './Environment.module.sass'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true })
let camera
let controls
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

let pauseAnimation = false
let spriteMaps = []
let clickable = []
let lights = {}

let dragTimer
let azimuthalAngle // side to side
let polarAngle // up, down
let dragging = false

let frames = 0
let frameTimer

let fov = (window.innerWidth < 760) ? 60 : 45
let cameraZ = 20
let bannerGroup = new THREE.Group()

const spriteMaterial = new THREE.SpriteMaterial({
	map: new THREE.TextureLoader().load('/images/sprite.png'),
})
const spriteTransitionMaterial = new THREE.SpriteMaterial({
	map: new THREE.TextureLoader().load('/images/sprite.png'),
	transparent: true,
	opacity: 1
})

export default function Environment() {

	const banner = useSelector(state => state.banner)
	const page = useSelector(state => state.page)
	let stardust = new THREE.Group()

	useEffect(() => {

		const appWrapper = document.querySelector('.' + s.webgl)
		// console.log(appWrapper)
		if (appWrapper.children.length <= 0) appWrapper.appendChild(renderer.domElement)

		camera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 0.1, 300)
		camera.position.set(0,0, cameraZ)
		renderer.setClearColor(0x222222, 0)
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFSoftShadowMap

		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableZoom = true
		controls.enableDamping = true
		controls.dampingFactor = 0.12
		// controls.rotateSpeed *= 0.4

		populate()
		light()
		animate()

	}, [])

	useEffect(() => {
		console.log('page is changing', page)
		if (spriteMaps[page]) { // Make sure there have been things added to it

			console.log('should rotate', bannerGroup.rotation, bannerGroup.children)
			new TWEEN.Tween({y: 0}).to({y: Math.PI * 4}, 2500)
				.easing(TWEEN.Easing.Exponential.InOut)
				.onUpdate(function() {
					bannerGroup.rotation.y = this.y
				})
				.onComplete(function() {
					console.log('animation completed', bannerGroup.rotation)
					bannerGroup.rotation.set(0, 0, 0)
				})
				.start()


			let currentSprites = bannerGroup.children.length
			let spriteMap = spriteMaps[page]
			let targetSprites = spriteMap.length
			console.log('sprite from', currentSprites, 'to', targetSprites)

			for (let x = 0; x < Math.min(currentSprites, targetSprites); x++) {
				let sprite = bannerGroup.children[x]
				let target = spriteMap[x]
				// console.log('target', sprite, target)
				// sprite.position.set(...target)
				let position = sprite.position
				new TWEEN.Tween({ x: position.x, y: position.y, z: position.z }).to({ x: target[0], y: target[1], z: target[2] }, 2500)
					.easing(TWEEN.Easing.Exponential.InOut)
					.onUpdate(function() {
						sprite.position.set(this.x, this.y, this.z)
					})
					.start()
			}

			if (currentSprites === targetSprites) {
				// do nothing
			} else if (currentSprites > targetSprites) { // Delete remaining
				console.log('removing sprites')
				spriteTransitionMaterial.opacity = 1
				for (let x = currentSprites - 1; x > targetSprites; x--) {
					let sprite = bannerGroup.children[x]
					sprite.material = spriteTransitionMaterial
					let pos = sprite.position
					new TWEEN.Tween({ x: pos.x, y: pos.y, z: pos.z }).to({ ...getRandomOutwardPosition(pos.x, pos.y, pos.z) }, 2500)
						.easing(TWEEN.Easing.Exponential.InOut)
						.onUpdate(function() {
							sprite.position.set(this.x, this.y, this.z)
						})
						.onComplete(function() {
							bannerGroup.remove(sprite)
						})
						.start()
				}
				new TWEEN.Tween({ opacity: 1 }).to({ opacity: 0}, 2500)
					.easing(TWEEN.Easing.Exponential.InOut)
					.onUpdate(function() {
						spriteTransitionMaterial.opacity = this.opacity
					})
					.start()
				// console.log('bannerGroup size', bannerGroup.children.length)
			} else { // Add more
				// console.log('adding more sprites')
				spriteTransitionMaterial.opacity = 0
				for (let x = currentSprites; x < targetSprites; x++) {
					let coords = spriteMap[x]
					const sprite = new THREE.Sprite(spriteTransitionMaterial)
					sprite.scale.set(...randomizeSpriteScale())
					sprite.position.set(0, 0, 0)
					bannerGroup.add(sprite)
					new TWEEN.Tween({ ...getRandomOutwardPosition(coords[0], coords[1], coords[2]) }).to({ x: coords[0], y: coords[1], z: coords[2] }, 3000)
						.easing(TWEEN.Easing.Exponential.InOut)
						.onUpdate(function() {
							sprite.position.set(this.x, this.y, this.z)
						})
						.onComplete(() => {
							sprite.material = spriteMaterial
						})
						.start()
				}
				new TWEEN.Tween({ opacity: 0 }).to({ opacity: 1}, 2500)
					.easing(TWEEN.Easing.Exponential.InOut)
					.onUpdate(function() {
						spriteTransitionMaterial.opacity = this.opacity
					})
					.start()
			}





		}
	}, [page])


	function getRandomOutwardPosition(x, y, z) {
		return {
			x: 0,
			y: 0,
			z: 0
		}
	}


	async function populate() {
		// addGuides()
		// addStardust()

		// let cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
		// let cubeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, metalness: 1, roughness: 1 })
		//
		// let cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
		// cube.position.set(0, 0, 0)
		// bannerGroup.add(cube)
		// console.log(cubeGeometry.attributes.position)

		let mtlFile = '/models/cartier_room.mtl'
		let mtlLoader = new MTLLoader()
		let materials = await mtlLoader.loadAsync(mtlFile)
		// console.log('materials', materials)


		// let loader = new OBJLoader()
		// loader.setMaterials(materials)
		//
		// let model = '/models/cartier_room.obj'
		// loader.load(model, (object) => {
		// 	object.scale.set(0.01,0.01,0.01)
		// 	object.position.set(0, -20, 0)
		// 	object.rotation.y = Math.PI / 12
		// 	console.log('loaded', object.children)
		// 	scene.add(object)
		// }, () => {
		// 	console.log('error')
		// })


		// spriteMaps['/'] = await formulateSprites('/models/rhino/scene.gltf', {
		// 	scale: 5.0,
		// 	position: [-0.5, -3, 0],
		// 	rotation: [0 - Math.PI / 2, 0, 0 - Math.PI / 2],
		// 	minDistance: 0.5,
		// 	maxDistance: 1.5
		// })
		// addToBanner(spriteMaps['/'])
		//
		// spriteMaps['/inspiration-museum'] = await formulateSprites('/models/ring/scene.gltf', {
		// 	scale: 4.0,
		// 	rotation: [-0.9, 0.25, 0],
		// 	minDistance: 0.1,
		// 	maxDistance: 5
		// })
		// // addToBanner(spriteMaps['ring'])
		//
		// spriteMaps['/ar-booth'] = await formulateSprites('/models/android/scene.gltf', {
		// 	scale: 2.5,
		// 	position: [0, 2, 0],
		// 	rotation: [0 - Math.PI / 2, 0, 0],
		// 	minDistance: 0.1,
		// 	maxDistance: 0.7
		// })

		// addBannerWobble()

		let loader = new GLTFLoader()
		let object = await loader.loadAsync('/models/android/scene.gltf')
		object.scene.scale.set(4,4,4)
		object.scene.position.set(0, -2, 0)

		// object.scene.position.set(11, 0.2, 23)
		let meshGroup = new THREE.Group()
		object.scene.traverse(function (child) {
			if (child.isMesh) {
				// console.log('child', child.geometry)
				child.castShadow = true
				child.receiveShadow = true
				child.material.metalness = 1
				child.material.roughness = 1
				console.log(child.geometry)
				addTriangles(child.geometry, { rotation: { x: -Math.PI / 2, y: 0, z: 0 } })
			}
		})
		// scene.add(object.scene)

		// let geometry = new THREE.BoxGeometry(4, 4, 4);
		// addTriangles(geometry, 2)

	}

	function crossVectors( a, b ) {
		let ax = a.X, ay = a.Y, az = a.Z;
		let bx = b.X, by = b.Y, bz = b.Z;
		let P={X:ay * bz - az * by,
			Y:az * bx - ax * bz,
			Z:ax * by - ay * bx}

		return P;
	}

	function addTriangles(geometry, options) {
		// check out the position attribute of a cube
		options = {
			scale: 1,
			max: 1000,
			...options
		}
		let group = new THREE.Group()
		let triangles = []
		let totalArea = 0

		const map = new THREE.TextureLoader().load( '/images/sprite.png' )
		const material = new THREE.SpriteMaterial({ map: map })
		const material2 = new THREE.SpriteMaterial({ map: map, transparent: true, opacity: 0.5 })

		let position = geometry.getAttribute('position')
		let positions = position.array
		let index = geometry.getIndex()
		console.log( 'indices', index.count, index.array )
		console.log( position.count ); // 24
		console.log( position.array.length ); // 72
		console.log( position.count * 3 === position.array.length); // true
		console.log( position.array )

		console.log('object processing: computing triangles')
		for (let i = 0; i < index.count; i += 3) {
			let buffGeom = new THREE.BufferGeometry()

			let indices = [index.array[i], index.array[i + 1], index.array[i + 2]]
			// console.log(indices)

			// let verticesArray = []
			// let firstPoint = []
			// let j = 0
			// indices.forEach(index => {
			// 	let adjustedIndex = index * 3
			// 	console.log(index, adjustedIndex)
			// 	for (let n = 0; n < 3; n++) {
			// 		verticesArray.push(positions[adjustedIndex] + n)
			// 		if (j === 0) firstPoint.push(positions[adjustedIndex] + n)
			// 	}
			// 	j++
			// })
			// verticesArray.push(...firstPoint)
			// console.log(verticesArray)
			// let vertices = new Float32Array(verticesArray)

			let x = positions[indices[0] * 3]
			let y = positions[indices[0] * 3 + 1]
			let z = positions[indices[0] * 3 + 2]
			let x2 = positions[indices[1] * 3]
			let y2 = positions[indices[1] * 3 + 1]
			let z2 = positions[indices[1] * 3 + 2]
			let x3 = positions[indices[2] * 3]
			let y3 = positions[indices[2] * 3 + 1]
			let z3 = positions[indices[2] * 3 + 2]

			// Calculate the area of the triangle
			let va={X:x,Y:y,Z:z};
			let vb={X:x2,Y:y2,Z:z2};
			let vc={X:x3,Y:y3,Z:z3};

			let ab = {X:vb.X-va.X,Y:vb.Y-va.Y,Z:vb.Z-va.Z};
			let ac = {X:vc.X-va.X,Y:vc.Y-va.Y,Z:va.Z-vc.Z};
			let cross = new THREE.Vector3();
			cross=crossVectors( ab, ac );
			let area = Math.sqrt(Math.pow(cross.X,2)+Math.pow(cross.Y,2)+Math.pow(cross.Z,2))/2
			totalArea += area
			console.log('area', area)

			// Place a single sprite
			// let spriteScale = 1 * area
			// let spritePosition = [(x + x2 + x3) / 3, (y + y2 + y3) / 3, (z + z2 + z3) / 3]
			//
			// let sprite = new THREE.Sprite(material)
			// sprite.position.set(...spritePosition)
			// sprite.scale.set(spriteScale, spriteScale, spriteScale)
			// group.add(sprite)

			let triangleData = [x, y, z, x2, y2, z2, x3, y3, z3, area]
			triangles.push(triangleData)

			// console.log(x, y, z, x2, y2, z2, x3, y3, z3, x, y, z)
			// let verticesArray = [x, y, z, x2, y2, z2, x3, y3, z3, x, y, z]
			// verticesArray.forEach((value, index) => {
			// 	verticesArray[index] = value * options.scale
			// })
			//
			// let vertices = new Float32Array(verticesArray)
			//
			// buffGeom.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
			// let line = new THREE.Line(
			// 	buffGeom,
			// 	new THREE.LineBasicMaterial({ color: 0x222222 })
			// )
			//
			// group.add(line)
		}

		console.log('total area is', totalArea)
		console.log(triangles, triangles.length)

		let spritesPerUnit = options.max / totalArea
		console.log('allow ', spritesPerUnit, 'sprites')

		let spriteScale = 0.02
		let totalSprites = 0

		for (let triangle of triangles) {
			console.log(triangle)
			let allowedSprites = spritesPerUnit * triangle[9]
			let remainder = allowedSprites % 1
			allowedSprites = Math.floor(allowedSprites)
			console.log(`allow ${allowedSprites} sprite(s) in this triangle with ${remainder} remainder`)
			if (Math.random() < remainder) allowedSprites++
			console.log('after roll', allowedSprites)

			// let spriteX = triangle[0] + triangle[3] + triangle[6] / 3
			// let spriteY = triangle[1] + triangle[4] + triangle[7] / 3
			// let spriteZ = triangle[2] + triangle[5] + triangle[8] / 3
			if (!allowedSprites) continue
			for (let n = 0; n <= allowedSprites; n++) {
				let spriteX = getRandomPointBetween(triangle[0], triangle[3], triangle[6])
				let spriteY = getRandomPointBetween(triangle[1], triangle[4], triangle[7])
				let spriteZ = getRandomPointBetween(triangle[2], triangle[5], triangle[8])
				if (spriteZ < 0) console.log('heres a negative Z')
				let sprite = new THREE.Sprite(spriteZ > 0 ? material : material2)

				sprite.position.set(spriteX, spriteY, spriteZ)
				sprite.scale.set(spriteScale, spriteScale, spriteScale)
				group.add(sprite)
				totalSprites++
			}

		}

		console.log(`${totalSprites} total sprites added`)


		console.log('object processing: getting rotated positions')
		group.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z)
		let points = []
		group.children.forEach(sprite => {
			let target = new THREE.Vector3()
			sprite.getWorldPosition(target)
			// points.push([sprite.position.x, sprite.position.y, sprite.position.z])
			points.push([target.x, target.y, target.z])
		})
		console.log('world position translated points', points)


		let rotatedGroup = new THREE.Group()
		points.forEach(point => {
			let sprite = new THREE.Sprite(material)
			sprite.position.set(point[0], point[1], point[2])
			sprite.scale.set(0.1,0.1,0.1)
			rotatedGroup.add(sprite)
		})
		console.log(rotatedGroup)

		scene.add(rotatedGroup)
	}

	function getRandomPointBetween(a, b, c) {
		let max = Math.max(a, b, c)
		let min = Math.min(a, b, c)
		let random = Math.random() * (max - min) + min
		return random
	}

	function addBannerWobble() {
		setInterval(() => {
			let intensity = 0.1
			new TWEEN.Tween({ x: bannerGroup.rotation.x, y: bannerGroup.rotation.y, z: bannerGroup.rotation.z })
				.to({ x: (Math.random() - 0.5) * intensity, y: (Math.random() - 0.5) * intensity, z: (Math.random() - 0.5) * intensity }, 2000)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onUpdate(function() {
					bannerGroup.rotation.set(this.x, this.y, this.z)
				})
				.start()
		}, 2000)
	}

	async function addToBanner(spriteMap) {
		const map = await new THREE.TextureLoader().load( '/images/sprite.png' )
		// console.log('sprite map', map)
		const material = new THREE.SpriteMaterial({ map: map })
		for (let coords of spriteMap) {
			const sprite = new THREE.Sprite(material)
			sprite.scale.set(0.1, 0.1, 0.1)
			// sprite.scale.set(...randomizeSpriteScale())
			sprite.position.set(...coords)
			bannerGroup.add(sprite)
		}
		scene.add(bannerGroup)
	}

	function addGuides() {
		const lineMaterial = new THREE.LineBasicMaterial({
			color: 0xd81921,
			transparent: true,
			opacity: 0.5
		})

		const points = []
		points.push( new THREE.Vector3( 0, 0, 0 ) )
		points.push( new THREE.Vector3( 0, 0, 20 ) )

		const geometry = new THREE.BufferGeometry().setFromPoints( points )

		const line = new THREE.Line( geometry, new THREE.LineBasicMaterial({
			color: 0xd81921,
			transparent: true,
			opacity: 0.5
		}))
		scene.add( line )

		const pointsY = []
		pointsY.push( new THREE.Vector3( 0, 0, 0 ) )
		pointsY.push( new THREE.Vector3( 0, 20, 0 ) )

		const geometryY = new THREE.BufferGeometry().setFromPoints( pointsY )

		const lineY = new THREE.Line( geometryY, new THREE.LineBasicMaterial({
			color: 0x6cbd38,
			transparent: true,
			opacity: 0.5
		}) )
		scene.add( lineY )

		lineMaterial.color.set(0x69FFFF)

		const pointsZ = []
		pointsZ.push( new THREE.Vector3( 0, 0, 0 ) )
		pointsZ.push( new THREE.Vector3( 20, 0, 0 ) )

		const geometryZ = new THREE.BufferGeometry().setFromPoints( pointsZ )

		const lineZ = new THREE.Line( geometryZ, lineMaterial )
		scene.add( lineZ )
	}

	function addStardust() {
		stardust = new THREE.Group()
		let spriteScale = 0.05
		const map = new THREE.TextureLoader().load( '/images/sprite.png' )
		const material = new THREE.SpriteMaterial({ map: map })

		let max = 20

		for (let x = 0; x <= 200; x++) {
			const sprite = new THREE.Sprite(material)
			sprite.position.set(0 - max + Math.random() * max * 2, 0 - max + Math.random() * max * 2, 0 - max + Math.random() * max * 2)
			let randomScale = spriteScale + Math.random() * 0.25
			sprite.scale.set(randomScale, randomScale, randomScale)
			stardust.add(sprite)
		}
		scene.add(stardust)
	}





	function light() {
		// let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
		// scene.add(ambientLight)

		let dLight = new THREE.DirectionalLight(0xFFFFFF, 0.5)
		dLight.position.set(3, 2, 3)
		scene.add(dLight)
	}

	function animate() {
		frames++
		// scene.rotation.y += 0.005
		stardust.rotation.y += 0.001
		// bannerGroup.rotation.y -= 0.004

		TWEEN.update()
		renderer.render(scene, camera)
		requestAnimationFrame(animate)
	}

	return (
		<div>
			<div className={s.webgl} />
		</div>
	)

}


function randn_bm() {
	let u = 0, v = 0;
	while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while(v === 0) v = Math.random();
	return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
}

function randomizeSpriteScale() {
	let baseScale = 0.02
	let randomScale = baseScale + 0.12 * randn_bm()
	// if (randomScale > 0.12) console.log('final scale', randomScale)
	return [randomScale, randomScale, randomScale]
}
