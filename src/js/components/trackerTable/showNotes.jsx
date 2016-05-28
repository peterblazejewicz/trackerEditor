import React, {Component} from 'react';

export default class ShowNotes extends Component{
	constructor (props) {
		super(props);
	}
	render () {
		var props = this.props;
		return (
			<thead>
				<tr>
					<td colSpan={2}></td>
					{this.props.track.map((note,i) =>{
						let show = note? note.note+note.octave:'-'
						if (note && this.props.show === 'low') {
							show = note.octave <= this.props.currentOctave? show:null
						} else if (note && this.props.show === 'high') {
							show = note.octave >= this.props.currentOctave? show:null
						}
						return (
							<td key={i} className='headerNotes'>
								{show}
							</td>
						)
					})}
				</tr>
			</thead>
		)
	}
}