import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerTable from './components/trackerTable/trackerTable.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';


const muiTheme = getMuiTheme();

render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<div>
			<h1><FontIcon className="material-icons">graphic_eq</FontIcon>Tracker editor <img src='http://i.giphy.com/Vg3c7Z8eXBZUQ.gif' width={100} style={{margin:'-40px 0'}}/></h1>
			<TrackerTable />
		</div>
	</MuiThemeProvider>
	,document.getElementById('app'));