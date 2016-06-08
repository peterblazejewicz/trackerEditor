import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';


export default class Channels extends Component{
	constructor (props) {
		super(props);
		this.state = {
			tracks : props.tracksList,
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
								<Channel key={channel.name} {...channel} trackList={that.state.tracks} addTrack={this.addTrack.bind(this,i)}/>
							)
						})}
					</tbody>
				</table>
			</div>
		)
	}
}

class Channel extends Component{
	constructor (props) {
		super(props);
		this.state = {
			open: false,
			formState: {}
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.addFormState = this.addFormState.bind(this);
	}
	handleOpen () {
		this.setState({open: true});
	}
	handleClose () {
		const formState = this.state.formState
		if (formState.value !== undefined && formState.repeat !== undefined) {
			if (!isNaN(formState.value) && !isNaN(formState.value)) {
				this.props.addTrack(formState);
				this.setState({open: false});
			}
		}
		
	}
	addFormState (formState) {
		this.setState({formState:formState})
	}
	
	render () {
		const actions = [
			<FlatButton
				label="Ok"
				primary={true}
				keyboardFocused={true}
				onClick={this.handleClose}
			/>,
	    ];
	    
	    const tracks = this.props.tracks
	    const trackList = this.props.trackList
		return (
			<tr>
				<th>{this.props.name}</th>
				<td>
					<Tracks tracks={tracks} trackList={trackList}/>
					<button onClick={this.handleOpen}>add track</button>
					
					<Dialog
          				title="Add a track to channel"
          				actions={actions}
          				modal={true}
          				open={this.state.open}
          				onRequestClose={this.handleClose}
        			>
        				<AddTrackForm tracks={this.props.trackList} addFormState={this.addFormState}/>
        			</Dialog>
				</td>
			</tr>	
		)
	}
}

class Tracks extends Component{
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
						repeatList.push(<span key={track.value+'_'+i} style={{width: selectedTrack.ticks*4}}>{selectedTrack.trackName}</span>)
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

class AddTrackForm extends Component{
	constructor (props) {
		super(props);
		this.state = {
			value: null,
			repeat: 1
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleRepeatChange = this.handleRepeatChange.bind(this);
	}

	handleChange (event, index, value) {
		this.setState({value})

		var state = {
			repeat: this.state.repeat,
			value: value
		}
		this.props.addFormState(state);
	}
	handleRepeatChange (e, repeat) {
		repeat = parseInt(repeat);
		repeat = (isNaN(repeat))? '':repeat;
		this.setState({repeat})

		var state = {
			repeat: repeat,
			value: this.state.value
		}
		this.props.addFormState(state);
	}
	render () {
		const tracks = [];
	    this.props.tracks.forEach((track,i) => {
        	tracks.push(<MenuItem key={i} value={i} primaryText={track.trackName} />);
        })
		return (
			<div>
				<SelectField value={this.state.value} onChange={this.handleChange}>
		        	{tracks}
		        </SelectField><br/>
	        	<TextField
			      id="text-field-default"
			      floatingLabelText="Repeat"
			      onChange={this.handleRepeatChange}
			      value={this.state.repeat}
			    />
	        </div>
		)
	}
}