import React, {Component} from 'react';
import NoteRows from './noteRows.jsx';
import FxRows from './fxRows.jsx';
import ShowNotes from './showNotes.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import TextField from 'material-ui/TextField';


export default class TrackerTable extends Component {
	constructor (props) {
		super(props);
		console.log(props.selectedTrack)
		this.state = {
			notes : ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],
			octaves : [4,5,6,7,8],
			currentOctave: 6,
			ticks : props.selectedTrack.ticks || 64,
			fx: ["volume"],
			track: props.selectedTrack.track || Array.apply(null, Array(64)).map(function (x, i) { return null; }),
			currentPlayingTick: null,
			trackName: props.selectedTrack.trackName || '#'
		}
		this.setFx = this.setFx.bind(this);
		this.setTone = this.setTone.bind(this);
		this.moveOctave = this.moveOctave.bind(this);
		this.playTrack = this.playTrack.bind(this);
		this.connectNoteWithNext = this.connectNoteWithNext.bind(this);
		this.setTicks = this.setTicks.bind(this);
		this.setName = this.setName.bind(this);
	}
	componentWillReceiveProps (nextProps) {
		const selectedTrack = nextProps.selectedTrack
		this.setState({
			ticks: selectedTrack.ticks,
			trackName: selectedTrack.trackName,
			track: selectedTrack.track,
			ATM: selectedTrack.ATM || ''
		})
	}
	setTone (obj) {
		var track = this.state.track.slice()

		if (track[obj.tick]) {
			if (track[obj.tick].note === obj.note && track[obj.tick].octave === obj.octave) {
				if (track[obj.tick].duration) {
					for (var i = 1; i < track[obj.tick].duration; i++) {
						track[obj.tick+1].duration = 0
					}
				}
				track[obj.tick] = null;
			} else {
				if (track[obj.tick].duration && track[obj.tick].duration > 0) {
					for (var i = 1; i < track[obj.tick].duration; i++) {
						track[obj.tick+1].duration = 0
					}
				} else if (track[obj.tick].duration && track[obj.tick].duration === -1) {
					let position = 1;
					while (track[obj.tick-position].duration === -1) {
						track[obj.tick-position].duration = 0
						position++;
					}
					track[obj.tick-position].duration = 0
					position = 1
					while (track[obj.tick + position] && track[obj.tick + position].duration === -1) {
						track[obj.tick + position].duration = 0
						position++;
					}
				}
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
		const ATM = makeATMTrack(track,this.state.ticks)

		this.props.setSelectedTrack({track,ATM});

		this.setState({
			track,
			ATM
		})
	}
	connectNoteWithNext(obj) {
		const track = this.state.track.slice()
		let currentTrack = track[obj.tick];
		let currentDuration = currentTrack.duration || 1
		let nextTrack = track[obj.tick + currentDuration]

		if (currentTrack && nextTrack) {
			if (currentTrack.note === nextTrack.note && currentTrack.octave === nextTrack.octave) {
				let duration = currentTrack.duration || nextTrack.duration || 1;
				if (currentTrack.duration > 0 && nextTrack.duration > 0) {
					duration = currentTrack.duration + nextTrack.duration -1;
				}
				currentTrack.note = obj.note;
				currentTrack.octave = obj.octave;
				currentTrack.duration =  duration +1;
				nextTrack.duration = -1
			}
			
		}
		const ATM = makeATMTrack(track,this.state.ticks);

		this.props.setSelectedTrack({track,ATM});

		this.setState({
			track,
			ATM
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
			    0,
		   262,  277,  294,  311,  330,  349,  370,  392,  415,  440,  466,  494,
		   523,  554,  587,  622,  659,  698,  740,  784,  831,  880,  932,  988,
		  1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976,
		  2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951,
		  4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902,
		  8372, 8870, 9397 
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
	setTicks (e, value) {
		let ticks = parseInt(value)
		ticks = (!ticks)? 0:ticks
		ticks = (ticks > 64)? 64:ticks


		if (ticks >= 0 && ticks <= 64) {
			const ATM = makeATMTrack(this.state.track,this.state.ticks)

			this.props.setSelectedTrack({ticks,ATM});

			this.setState({
				ticks,
				ATM
			})
		}

		
	}
	setName (e, value) {
		const trackName = value

		this.props.setSelectedTrack({trackName});

		this.setState({
			trackName: trackName
		})
	}
	render () {
		var state = this.state
		return (
			<div>
				<h2>Track Editor</h2>
				<RaisedButton label="Play" onClick={this.playTrack} primary={true} icon={<PlayArrow/>}/>
				<div style={{marginLeft:'88px'}}><TextField
			      	hintText="Track ##"
			      	floatingLabelText="Track name"
			      	onChange={this.setName}
			      	value={state.trackName}
			    /><br/>
			    <TextField
			    	ref='ticks (min 4, max 64)'
			      	floatingLabelText="Track ticks"
			      	value={state.ticks}
			      	onChange={this.setTicks}
			    /></div>
				<table>
						<ShowNotes {...state} show='low'/>
						<NoteRows {...state} setTone={this.setTone} moveOctave={this.moveOctave} connectNoteWithNext={this.connectNoteWithNext}/>
						<ShowNotes {...state} show='high'/>
						{//<FxRows fx={this.state.fx} ticks={this.state.ticks} setFx={this.setFx} />
					}
				</table>
				<ATMTrack AMT={this.state.ATM}/>
			</div>
		)
	}
}

const ATMTrack = (props) => {
	return <div style={{marginLeft:'88px'}}>
		<h3>ATM Track</h3>
		<p className="ATMTrack">{JSON.stringify(props.AMT)}</p>
	</div>
}

function makeATMTrack(track, ticks) {
	ticks = ticks || 64;
	const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

	function searchStringInArray (str, strArray) {
	    for (var j=0; j<strArray.length; j++) {
	        if (strArray[j].match(str)) return j;
	    }
	    return -1;
	}
		   

	const ATMTrack = [];
	ATMTrack.push("Track");
	let i = 0;
	while (i < ticks) {
		const tick = track[i]
		if (tick) {
			let duration = 1
			if (tick.duration && tick.duration > 0) {
				duration = tick.duration
			}
    		const pos = searchStringInArray(tick.note, notes);
			const tone = ((tick.octave - 4) * notes.length) + pos;
			ATMTrack.push(tone); 				// 0x00 + tone NOTE ON
			ATMTrack.push(159+duration);		// 0x9F + duration
			ATMTrack.push(0);					// 0x3F NOTE OFF
			i = i + duration;
		} else {
			let delayLength = 1;
			let done = true;
			while (done) {
				if(track[i+delayLength] || i+delayLength === ticks) {
					done = false
				} else {
					delayLength++
				}
			}
			i = i + delayLength;
			ATMTrack.push(159+delayLength);
		}

	}
	ATMTrack.push(254); // return
	return ATMTrack
}
	


