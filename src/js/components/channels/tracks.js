import React, {Component} from 'react';


export default class Tracks extends Component{
	constructor (props) {
		super(props);
	}
	render () {
		const tracks = this.props.tracks
		const trackList = this.props.trackList
		return (
			<div>
				{tracks.map((track) => {
					const selectedTrack = trackList[track.value];
					const repeatList = []
					for (var i = 0; i < track.repeat; i++) {
						repeatList.push(
							<span key={track.value+'_'+i} style={{
								width: (selectedTrack.ticks*4)-1, 
								backgroundColor: selectedTrack.color,
								borderRight : "1px solid white",
								height: 10,
								display: "inline-block"
							}}></span>)
					}
					return (
						<span key={track.value}>
							{repeatList}
						</span>
					)
				})}
			</div>
		)
	}
}