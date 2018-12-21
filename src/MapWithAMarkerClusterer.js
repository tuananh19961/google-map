import React, {Component} from 'react';
import {compose, withProps, withHandlers} from "recompose";
import {withGoogleMap, GoogleMap, Marker, withScriptjs} from "react-google-maps";
import {MarkerClusterer} from "react-google-maps/lib/components/addons/MarkerClusterer";

class MapWithAMarkerClusterer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markerObjects: []
        }

        this.onMarkerMounted = element => {
            this.setState(prevState => ({
              markerObjects: [...prevState.markerObjects, element]
            }))
        };
    }

    onMouseover = (marker) => {
        
    }
    onMouseout = (marker) => {
        
    }
    
    componentDidUpdate(next){
        if(this.state.markerObjects !== {}){
            this.props.listMarker(this.state.markerObjects)
        }
       
    }

    render() {
        console.log(this.props);
        const icon = {
            url: './marker.png',
            scaledSize: {
                width: 25,
                height: 25
            }
        };

        const iconUser = {
            url: 'http://os-ekvaternika-rakovica.skole.hr/upload/os-ekvaternika-rakovica/images/multistatic/80/Image/source.gif',
            scaledSize: {
                width: 40,
                height: 40
            }
        };
        // console.log(this.state.markerObjects);
        return (
            <GoogleMap
                defaultZoom={14}
                defaultCenter={{
                lat: 16.044522,
                lng: 108.216663
            }}>
                <MarkerClusterer
                    onClick={this.onMarkerClustererClick}
                    averageCenter
                    enableRetinaIcons
                    gridSize={60}>
                    {this.props
                        .markers
                        .map((marker, index) => (<Marker
                            ref={this.onMarkerMounted}
                            key={index}
                            icon={icon}
                            position={{
                            lat: marker.latitude,
                            lng: marker.longitude
                        }}
                            animation = {1}
                            onMouseOver={this.onMouseover}
                            onMouseOut={this.onMouseout}
                        />))}
                </MarkerClusterer>
                {
                    this.props.currentLocation.coords && <Marker
                    icon={iconUser}
                    position={{
                    lat: this.props.currentLocation.coords.latitude,
                    lng: this.props.currentLocation.coords.longitude
                }}
                    />
                }

            </GoogleMap>
        )
    }
};

export default compose(withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAiQX1yfcvHCeM98e6asi-Wi-Y_H4-V1Qw&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{
        height: `100%`
    }}/>,
    containerElement: <div style={{
        height: `100vh`
    }}/>,
    mapElement: <div style={{
            height: `100%`
        }}/>
}),
withHandlers({
  onMarkerClustererClick: () => (markerClusterer) => {
    const clickedMarkers = markerClusterer.getMarkers()
    console.log(`Current clicked markers length: ${clickedMarkers.length}`)
    console.log(clickedMarkers)
  },
}), withScriptjs, withGoogleMap)(MapWithAMarkerClusterer);