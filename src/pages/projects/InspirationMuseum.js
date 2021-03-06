import React, {useEffect} from 'react'
import TitleTemplate from "../../sections/templates/Title"
import IntroTemplate from "../../sections/templates/Intro"
import ScrollProgress from "../../components/ScrollProgress"
import {useDispatch} from "react-redux";
import SidePanelTemplate from "../../sections/templates/SidePanel"
import BlankTemplate from "../../sections/templates/Blank"

import lobbyImage from '../../media/projects/InspirationMuseum/musuem-lobby.jpg'

export default function InspirationMuseumPage() {

	const goals = [
		'Engage VIP in retail stores',
		'Browse the rich catalog of Cartier designs',
		'Upsell them on a custom design'
	]

	const dispatch = useDispatch()

	useEffect(() => {
		console.log('ar booth page mounted')
		dispatch({ type: 'SET_PROGRESS_BAR', active: true })

		let pageHeight = document.querySelector('.page-inner').getBoundingClientRect().height
		dispatch({ type: 'SET_PAGE_HEIGHT', height: pageHeight })

	}, [])

	return (
		<div className={"page"}>
			<div className={"page-inner"} style={{ position: 'relative' }}>
				{/*<ScrollProgress />*/}
				<TitleTemplate title={"Inspiration Museum"} object={"ring"}/>
				<IntroTemplate goals={goals}
				   	title={<div>How to engage VIP retail shoppers</div>}
				   	subtitle={<div>(and their wallets)</div>}
					/>
				<SidePanelTemplate
					title={"Create the 3D environment"}
					content={<div>
						<p>Make a good 3D environment and fill it with key imagery</p>
						<div style={{ fontWeight: 'bold' }}>more project details to come</div>
					</div>}
					cover={lobbyImage}
					object={"pillar"}
					/>
				{/*<SidePanelTemplate*/}
				{/*	title={"Load all the photos into it"}*/}
				{/*	content={"Make a good 3D environment and fill it with key imagery"}*/}
				{/*	object={"frame"}*/}
				{/*/>*/}
				{/*<BlankTemplate*/}
				{/*	title={"VIP customers receive a custom designed jewelry item"}*/}
				{/*	/>*/}
			</div>
		</div>
	)

}
