import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import getNearby from './lib/getNearby';

const Me = () => <i>•</i>;

const Pin = ({ text }) => <div>{text}</div>;

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

    static defaultProps = {
        center: {
            lat: 45.564455,
            lng: -122.630576
        },
        zoom: 15
    };

    componentDidMount() {
        let newNearbyPlaces = loc => {
            let lat = loc.coords.latitude;
            let lng = loc.coords.longitude;
            let places = getNearby(lat,lng);
            places.then(json => {

console.log(json)

                this.setState({
                    pins: json.query.pages
                });
            });
        };

        let geo = navigator.geolocation.watchPosition(newNearbyPlaces)
    }

    render() {
        let { pins } = this.state;
        let { center, zoom } = this.props;
        return (
          <div style={{ height: '100vh', width: '100vw' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyDvSl4yqevaoY63RJwzf74Civuq4uCBWf0' }}
              defaultCenter={ center }
              defaultZoom={ zoom }
            >
                <Me center={ center } />
                <Pins pins={ pins } />
            </GoogleMapReact>
          </div>
        );
    }
}

export default Map;