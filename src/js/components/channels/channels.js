import React, {Component} from 'react';
import Channel from './channel';

export default class Channels extends Component{
	constructor (props) {
		super(props);
		this.state = {
			channels : [
				{
					name: 'Channel 1',
					tracks:[]
				},{
					name: 'Channel 2',
					tracks:[]
				},{
					name: 'Channel 3',
					tracks:[]
				},{
					name: 'Channel 4',
					tracks:[]
				}
			]
		}
		this.addTrack = this.addTrack.bind(this);
	}
	addTrack (channel,track) {
		const channels = this.state.channels.slice()
		channels[channel].tracks.push(track);
	}
	render () {
		var that = this;
		return (
			<div>
				<h2>Channel editor</h2>
				<table>
					<tbody>
						{this.state.channels.map((channel,i) => {
							return (
								<Channel key={channel.name} {...channel} trackList={that.props.tracksList} addTrack={this.addTrack.bind(this,i)}/>
							)
						})}
					</tbody>
				</table>
			</div>
		)
	}
}