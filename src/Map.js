import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const Pin = ({ text }) => <div>{text}</div>;

const getNearby = async (lat, lng) => {
    let url = `https://segdeha.com/api/nearby.php?lat=${lat}&lng=${lng}`;
    let response = await fetch(url);

    if (response.ok) { // if HTTP-status is 200-299
        // get the response body (the method explained below)
        let json = await response.json();
        return json;
    }
    else {
        console.error(`HTTP Error: ${response.status}`);
        return {
            status: 400,
            query: {
                pages: []
            }
        };
    }
};

const Pins = pins => {
    return (
        <div />
    );
};

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
          pins: []
        };
    }

    componentDidMount() {
        // TODO make this dynamic based on browser location
        let lat = 45.53341;
        let lng = -122.6307;

        let places = getNearby(lat,lng);

        places.then(json => {

console.log(json)

            this.setState({
                pins: json.query.pages
            });
        });

    }

    static defaultProps = {
        center: {
            lat: 45.564455,
            lng: -122.630576
        },
        zoom: 11
    };

    render() {
        let { pins } = this.state;
        return (
          <div style={{ height: '100vh', width: '100vw' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
            >
                <Pins pins={ pins } />
            </GoogleMapReact>
          </div>
        );
    }
}

export default Map;