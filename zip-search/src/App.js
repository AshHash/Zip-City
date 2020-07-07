import React from 'react';
import './App.css';

const request = require('request');

// Returns formatted data
function Entry(props) {
	return (
		<div className="resultBox">
			<h3>{props.city}, {props.state}</h3>
			<ul>
				<li>State: {props.state}</li>
				<li>Location: {props.location}</li>
				<li>Est. Population: {props.pop}</li>
				<li>Total Wages: {props.wages} </li>
			</ul>
		</div>
	)
}

class App extends React.Component {
	constructor(props) {
    super(props);
    this.state = {};
  }
  	// Only attempts to look up by zip if field contains exactly 5 characters
	lookItUp(zip) {
		if (zip.length - 5) return;

		request("http://ctp-zip-api.herokuapp.com/zip/" + zip, 
			{ json: true }, 
			(err, res, body) => {
			  if (err) { return console.log(err); }

			  const entries = [];
			  // If input results in 404 page, don't iterate over body
			  res.statusCode !== 404 && body.forEach(zip => {
			  	entries.push({
		 	 			key: zip.RecordNumber,
						city: zip.City,
						state: zip.State,
						location: `(${zip.Lat}, ${zip.Long})`,
						pop: zip.EstimatedPopulation,
						wages: zip.TotalWages
			  	});
			  })
			  // Stores retrieved data as an object in state
			  this.setState({entries});
			}
		);
	}

	render() {
		let results = [];

		this.state.entries && this.state.entries.forEach(entry => {
			results.push(
				<Entry
					key={entry.key} 
					city={entry.city}
					state={entry.state}
					location={entry.location}
					pop={entry.pop}
					wages={entry.wages} 
				/>
			);
		});

		return (
	    <div className="App">
	    	<div className="header">
	    		Zip Code Search
	    	</div>
	    	<div className="box">
	    		Zip Code:&nbsp;
	    		<input 
	    			placeholder="Try 10016" 
	    			onChange={evt => this.lookItUp(evt.target.value)} 
	    		/>
	    	</div>
	    	<div className="results">
	    		{results}
	    	</div>
	    </div>
		);
	}
}

export default App;
