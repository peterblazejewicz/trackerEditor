import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

export default class AddTrackForm extends Component{
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