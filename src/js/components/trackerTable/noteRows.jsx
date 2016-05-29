import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

export default class NoteRows extends Component{
	constructor (props) {
		super(props);
	}
	render () {
		var props = this.props;
		return (
			<tbody>
				{this.props.notes.map((note) =>{
					return (
						<NoteRow key={note} note={note} {...props}/>
					)
				})}
			</tbody>
		)
	}
}

class NoteRow extends Component {
	constructor (props) {
		super (props);
		this.state = {
			note: props.note
		}
		this.setTone = this.setTone.bind(this);
		this.moveOctave = this.moveOctave.bind(this);
		this.connectWithNext = this.connectWithNext.bind(this);
	}
	setTone (e) {
		e.note = this.state.note
		e.octave = this.props.currentOctave
		this.props.setTone(e);
	}
	moveOctave (add) {
		this.props.moveOctave(add);
	}
	connectWithNext (tick,e) {
		e.stopPropagation();
		this.props.connectNoteWithNext({
			note: this.state.note,
			octave: this.props.currentOctave,
			tick: tick.tick
		})
	}
	render () {

		var that = this
		var ticksArray = Array.apply(null, Array(this.props.ticks)).map(function (x, i) { return i; })
		return (
			<tr>
				{this.state.note === "C"? <Up moveOctave={this.props.moveOctave.bind(this,-1)}/>:null}
				{this.state.note === "F"? <td></td>:null}
				{this.state.note === "G"? <Down moveOctave={this.props.moveOctave.bind(this,1)}/>:null}
				<th>{this.state.note}{this.props.currentOctave}</th>
				{ticksArray.map((x) => {
					let cellClass = 'toneNotSet';

					let canConnectWithNext = false;
					let duration = 0;
					const trackTick = that.props.track[x];

					if (this.state.note.indexOf('#') > 0) {
						cellClass = cellClass + ' sharp';
					}

					if (trackTick) {
						console.log(trackTick.duration)
						const trackTickDuration = trackTick.duration || 1;
						const nextTrackTick = that.props.track[x+trackTickDuration];
						if (trackTick.note === that.state.note && this.props.currentOctave === trackTick.octave) {
							cellClass= 'toneSet';
							if (nextTrackTick && trackTick) {
								if (nextTrackTick.note === trackTick.note && nextTrackTick.octave === trackTick.octave) {
									// add connector between two notes
									canConnectWithNext = true;
								}
							}
							duration = trackTick.duration
						} else {
							duration = 1
						}

						cellClass = cellClass + ' colSet'

						if (trackTick.duration !== -1 || duration === 1) {
							return (
								<NoteCell colSpan={duration} cellClass={cellClass} key={x + this.props.currentOctave} tick={x} clickOnCell={that.setTone} canConnectWithNext={canConnectWithNext} connectWithNext={this.connectWithNext}/>
							)
						} else {
							return (null)
						}
					}
					return (
						<NoteCell colSpan={1} cellClass={cellClass} key={x + this.props.currentOctave} tick={x} clickOnCell={that.setTone} canConnectWithNext={canConnectWithNext} connectWithNext={this.connectWithNext}/>
					)
					
					
					
					
				})}
			</tr>
		)
	}
}

class NoteCell extends Component{
	constructor (props) {
		super(props);
		this.state = {
			showConnect: false
		}
		this.showConnect = this.showConnect.bind(this);
	}
	showConnect () {
		this.setState({
			showConnect: !this.state.showConnect
		})
	}
	render () {
		return <td colSpan={this.props.colSpan} className={this.props.cellClass} onMouseEnter={this.showConnect} onMouseLeave={this.showConnect} onClick={this.props.clickOnCell.bind(null,{tick: this.props.tick})}>
			{this.props.canConnectWithNext && this.state.showConnect?
				<ConnectWithNext connectWithNext={this.props.connectWithNext.bind(null,{tick: this.props.tick})}/>
				:null}
		</td>
	}
}

const Up = (props) => {
	return <td rowSpan="5" onClick={props.moveOctave}>
		<IconButton><FontIcon  className="material-icons">arrow_upward</FontIcon></IconButton>
		</td>
}
const Down = (props) => {
	return <td rowSpan="5" onClick={props.moveOctave}><IconButton><FontIcon className="material-icons">arrow_downward</FontIcon></IconButton></td>
}

const ConnectWithNext = (props) => {
	return <div className="connectable">
		<button onClick={props.connectWithNext}>+</button>
	</div>
}