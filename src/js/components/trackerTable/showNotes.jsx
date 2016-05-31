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
						if (i > this.props.ticks-1) return;
						let show = note? note.note+note.octave:'-'
						const className = note? 'active':''
						if (note && this.props.show === 'low') {
							show = note.octave <= this.props.currentOctave? show:null
						} else if (note && this.props.show === 'high') {
							show = note.octave >= this.props.currentOctave? show:null
						}
						if (note && note.duration) {
							if (note.duration > 0) {
								return (
									<td key={i} className={'headerNotes ' + className} colSpan={note.duration}>
										{show}
									</td>
								)
							} else {
								return null
							}
						} else {
							return (
								<td key={i} className={'headerNotes ' + className}>
									{show}
								</td>
							)
						}
						
					})}
				</tr>
			</thead>
		)
	}
}