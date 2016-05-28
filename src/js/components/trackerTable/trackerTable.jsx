import React, {Component} from 'react';
import NoteRows from './noteRows.jsx';
import FxRows from './fxRows.jsx';
import ShowNotes from './showNotes.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

export default class TrackerTable extends Component {
	constructor (props) {
		super(props);
		this.state = {
			notes : ["C","C#","D","D#","E","F","G","G#","A","A#","B"],
			octaves : [4,5,6,7,8],
			currentOctave: 6,
			ticks : 64,
			fx: ["volume"],
			track: Array.apply(null, Array(64)).map(function (x, i) { return null; }),
			currentPlayingTick: null
		}
		this.setFx = this.setFx.bind(this);
		this.setTone = this.setTone.bind(this);
		this.moveOctave = this.moveOctave.bind(this);
		this.playTrack = this.playTrack.bind(this);
	}
	setTone (obj) {
		var track = this.state.track.slice()

		if (track[obj.tick]) {
			if (track[obj.tick].note === obj.note && track[obj.tick].octave === obj.octave) {
				track[obj.tick] = null
			} else {
				track[obj.tick] = {
					note: obj.note,
					octave: obj.octave
				}
			}
			
		} else {
			track[obj.tick] = {
				note: obj.note,
				octave: obj.octave
			}
		}

		this.setState({
			track
		})
	}
	moveOctave (add) {
		if (this.state.currentOctave === this.state.octaves[0] && add === -1) {
			return
		}
		if (this.state.currentOctave === this.state.octaves[this.state.octaves.length-1] && add === 1) {
			return
		}
		this.setState({
			currentOctave: this.state.currentOctave + add
		})
	}
	setFx () {
		console.log(arguments)
	}
	playTrack () {
		var noteTable = [
		   262,  277,  294,  311,  330,  349,  370,  392,  415,  440,  466,  494,
		   523,  554,  587,  622,  659,  698,  740,  784,  831,  880,  932,  988,
		  1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976,
		  2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951,
		  4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902,
		  8372, 8870, 9397,    0, 
		];

		var notes = this.state.notes;

		var index = 0
		// create web audio api context
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

		// create Oscillator node
		var oscillator = audioCtx.createOscillator();

		oscillator.type = 'square';
		oscillator.frequency.value = 0; // value in hertz
		oscillator.connect(audioCtx.destination);
		oscillator.start();
		var that = this;

		function searchStringInArray (str, strArray) {
		    for (var j=0; j<strArray.length; j++) {
		        if (strArray[j].match(str)) return j;
		    }
		    return -1;
		}
		
		var interval = setInterval(function () {
			if (index > 63) {
				clearInterval(interval);
				oscillator.stop();
				return
			}

			if (that.state.track[index]) {
				const tick = that.state.track[index]
				const pos = searchStringInArray (tick.note, notes);
				const finPos = ((tick.octave - 4) * notes.length) + pos;
				const notefreq = noteTable[finPos]
				oscillator.frequency.value = notefreq;
			} else {
				oscillator.frequency.value = 0;
			}
			index++
		},400)
	}
	render () {
		var state = this.state
		return (
			<div>
				<RaisedButton label="Play" onClick={this.playTrack} primary={true} icon={<FontIcon className="material-icons">play_arrow</FontIcon>}/>
				<table>
						<ShowNotes {...state} show='low'/>
						<NoteRows {...state} setTone={this.setTone} moveOctave={this.moveOctave}/>
						<ShowNotes {...state} show='high'/>
						{//<FxRows fx={this.state.fx} ticks={this.state.ticks} setFx={this.setFx} />
					}
				</table>
			</div>
		)
	}
}