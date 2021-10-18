import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch} from "react-redux"
import {setCameraPosition} from "../Environment"

import s from './Home.module.sass'

export default function HomePage() {

	const dispatch = useDispatch()

	useEffect(() => {
		setCameraPosition(0, 18, 18, 0, 0, -2)
		dispatch({ type: 'SET_OBJECT', object: 'none' })
		dispatch({ type: 'SET_TITLE', title: ''})
	}, [])

	return (
		<div className={s.wrapper}>
			<Link to={"/projects/inspiration-museum"}>Inspiration Museum</Link>
			<Link to={"/projects/ar-immersion-booth"}>AR Immersion Booth</Link>
			<Link to={"/info"}>Learn More</Link>
		</div>
	)

}
