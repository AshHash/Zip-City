import React from 'react';
import './App.css';

const request = require('request');

// Function that returns all zip-codes in a block
function Entry(props) {
	return (
		<div 
			style={{display: props.zips ? "block" : "none"}} 
			className="resultBox">
			<h3>{props.city}</h3>
			<h3>{props.zips && props.zips.join(', ')}</h3>
		</div>
	)
}

class App extends React.Component {
	constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Parses input and converts to uppercase
   * Doesn't attempt to read from 404 pages
   * Sets each zip code associated with a city within object state
   * Then renders all associated zip-codes
   */
	lookItUp(city) {
		/*if(city.toUpperCase() === "GULLIBLE") {
			this.setState({
				city: "This is definitely not hardcoded.",
				entries: ["00042"]
			});
			return;
		}*/
		request("http://ctp-zip-api.herokuapp.com/city/" + city.toUpperCase(), 
			{ json: true }, 
			(err, res, body) => {
		  		if (err) { return console.log(err); }
				res.statusCode !== 404 && this.setState({
					city,
					entries: body.sort()
				});
			}
		);
	}

	render() {
		return (
	    <div className="App">
	    	<div className="header">
	    		City Search
	    	</div>
	    	<div className="box">
	    		City:&nbsp;
	    		<input 
	    			placeholder="Try Gullible" 
	    			onChange={evt => this.lookItUp(evt.target.value)} 
	    		/>
	    	</div>
	    	<div className="results">
	    		<Entry 
	    			city={this.state.city}
					zips={this.state.entries}
				/>
	    	</div>
	    </div>
		);
	}
}

export default App;
