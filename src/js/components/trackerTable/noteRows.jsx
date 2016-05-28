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
	}
	setTone (e) {
		e.note = this.state.note
		e.octave = this.props.currentOctave
		this.props.setTone(e);
	}
	moveOctave (add) {
		this.props.moveOctave(add);
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
					const trackTick = that.props.track[x]
					if (trackTick) {
						if (trackTick.note === that.state.note && this.props.currentOctave === trackTick.octave) {
							cellClass= 'toneSet'
						}
						cellClass = cellClass + ' colSet'
					}
					if (this.state.note.indexOf('#') > 0) {
						cellClass = cellClass + ' sharp';
					}
					return (
						<NoteCell cellClass={cellClass} key={x + this.props.currentOctave} tick={x} clickOnCell={that.setTone} />
					)
				})}
			</tr>
		)
	}
}

const NoteCell = (props) => {
	return <td className={props.cellClass} onClick={props.clickOnCell.bind(null,{tick: props.tick})}></td>
}

const Up = (props) => {
	return <td rowSpan="5" onClick={props.moveOctave}>
		<IconButton><FontIcon  className="material-icons">arrow_upward</FontIcon></IconButton>
		</td>
}
const Down = (props) => {
	return <td rowSpan="5" onClick={props.moveOctave}><IconButton><FontIcon className="material-icons">arrow_downward</FontIcon></IconButton></td>
}