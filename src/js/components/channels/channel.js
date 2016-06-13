import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Tracks from './tracks';
import AddTrackForm from './addTrackForm';

export default class Channel extends Component{
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
			} else {
				this.setState({open:false})
			}
		} else {
			this.setState({open:false})
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
				onClick={this.handleClose}
			/>,
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.handleClose}
			/>
	    ];
	    
	    const tracks = this.props.tracks
	    const trackList = this.props.trackList
	    console.log(trackList.length)
		return (
			<tr>
				<th>{this.props.name}</th>
				<td>
					<Tracks tracks={tracks} trackList={trackList}/>
					<button onClick={this.handleOpen}>add track</button>
					<Dialog
          				title="Add a track to channel"
          				actions={actions}
          				modal={false}
          				open={this.state.open}
          				onRequestClose={this.handleClose}
        			>
        				<AddTrackForm tracks={trackList} addFormState={this.addFormState}/>
        			</Dialog>
				</td>
			</tr>	
		)
	}
}