const defaultState = {
	rotation: { x: 0, y: 0 },
	rotationObject: 'stage',
	scenePosition: 'center',
	object: 'none',
	deviceOrientation: '',
	windowDimensions: { width: 1000, height: 1000 },
	progressBarActive: false,
	pageHeight: 0
}

const SystemReducer = (state = defaultState, action) => {
	switch (action.type) {
		case 'SET_ROTATION':
			return {
				...state,
				rotation: action.rotation
			}
		case 'SET_ROTATION_OBJECT':
			return {
				...state,
				rotationObject: action.object
			}
		case 'SET_SCENE_POSITION':
			return {
				...state,
				scenePosition: action.position
			}
		case 'SET_TITLE':
			return {
				...state,
				title: action.title
			}
		case 'SET_OBJECT':
			return {
				...state,
				object: action.object
			}
		case 'SET_DEVICE_ORIENTATION':
			return {
				...state,
				deviceOrientation: action.orientation
			}
		case 'SET_WINDOW_DIMENSIONS':
			return {
				...state,
				windowDimensions: { width: action.width, height: action.height }
			}
		case 'SET_PROGRESS_BAR':
			return {
				...state,
				progressBarActive: action.active
			}
		case 'SET_PAGE_HEIGHT':
			return {
				...state,
				pageHeight: action.height
			}
		default:
			return state
	}
}

export default SystemReducer
