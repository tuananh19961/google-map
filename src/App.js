import React, {Component} from 'react';
import './App.css';
import {Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Card,
    CardHeader,
    CardBody,
    ListGroup,
    ListGroupItem
} from 'reactstrap';

const positions = [
    {
        name: 'PNX',
        lat: 16.036505,
        lng: 108.218185
    }, {
        name: 'TDT',
        lat: 16.037157,
        lng: 108.216959
    }, {
        name: 'TXT',
        lat: 16.037379,
        lng: 108.217404
    }, {
        name: 'NTN',
        lat: 16.035671,
        lng: 108.217180
    }
    ,{
        name: 'SPDN',
        lat: 16.064964,
        lng: 108.184093
    }
];


class App extends Component {
   constructor(props) {
       super(props);

       this.onMarkerMounted = element => {
        this.setState(prevState => ({
          markerObjects: [...prevState.markerObjects, element.marker]
        }))
      };

   }

   
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        markerObjects: [],
        onMap: {}
    };

    componentDidMount() {
        // GET CURRENT LOCATION OF USER
        this.geoId = navigator.geolocation.getCurrentPosition(
          (position) => {
             this.setState({
                 u_position: position
             });
          },
          (error) => {
            console.log(error)
          },
          {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
        )

    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.geoId)
    }

    // Function on Map
    onMarkerClick = (props, marker, e) => {
        const DirectionsService = new this.props.google.maps.DirectionsService();
        
        this.setState({selectedPlace: props, activeMarker: marker, showingInfoWindow: true})

        // GET PATH FROM CURRENT LOCATION TO CHOOSE LOCATION 
        DirectionsService.route({
            origin: new this.props.google.maps.LatLng(this.state.u_position.coords.latitude, this.state.u_position.coords.longitude),
            destination: marker.getPosition(),
            travelMode: this.props.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === this.props.google.maps.DirectionsStatus.OK) {
                const overViewCoords = result.routes[0].overview_path;
                this.setState({
                  directions: overViewCoords,
                });
              }
          });
    };

    onMouseover = (props, marker, e) => {
        marker.setAnimation(1)
    }
    onMouseout = (props, marker, e) => {
        marker.setAnimation(0)
    }

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({showingInfoWindow: false, activeMarker: null})
        }
    };

    onMarkerClustererClick = () => (markerClusterer) => {
        const clickedMarkers = markerClusterer.getMarkers()
        console.log(`Current clicked markers length: ${clickedMarkers.length}`)
        console.log(clickedMarkers)
    }

    render() {
        var {markerObjects,activeMarker} = this.state;

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
                width: 32,
                height: 32
            }
        };

      

       

        return (
            <div className="App">
                <Container>
                    <Row>
                        <Col xs="8">
                            <Map
                                google={this.props.google}
                                onClick={this.onMapClicked}
                                className="map"
                                id="onMap"
                                initialCenter={{
                                lat: activeMarker.position ? activeMarker.position.lat() : 16.036500,
                                lng: activeMarker.position ? activeMarker.position.lng() :108.218105
                                }}
                                zoom={activeMarker.position ? 20 : 15}>

                                {/* Current location of user */}
                                {
                                    this.state.u_position && <Marker
                                    icon={iconUser}
                                    position={{
                                        lat: this.state.u_position.coords.latitude,
                                        lng: this.state.u_position.coords.longitude
                                    }}
                                    info="your at here"
                                    />
                                }

                                {/* List all location  */}          
                                        {
                                            positions.map((item, index) => {
                                                return (<Marker
                                                    ref={this.onMarkerMounted}
                                                    icon={icon}
                                                    onClick={this.onMarkerClick}
                                                    onMouseover={this.onMouseover}
                                                    onMouseout={this.onMouseout}
                                                    title={'The marker`s title will appear as a tooltip.'}
                                                    name={item.name}
                                                    position={{
                                                    lat: item.lat,
                                                    lng: item.lng
                                                }}
                                                    key={index}/>)
                                            })
                                        }                                                   
                                {
                                    this.state.directions && <Polyline
                                     path={this.state.directions}
                                     geodesic={false}
                                     options={{
                                         strokeColor: '#f4c542',
                                         strokeOpacity: 2,
                                         strokeWeight: 6,
                                     }}
                                    /> 
                                }
                                <InfoWindow
                                    marker={this.state.activeMarker}
                                    visible={this.state.showingInfoWindow}>
                                    <div>
                                        <h1>{this.state.selectedPlace.name}</h1>
                                    </div>
                                </InfoWindow>
                            </Map>
                        </Col>

                        <Col xs="4">
                            <Form>
                                <h1>Fillter</h1>
                                <FormGroup>
                                    <Label for="exampleEmail">Street</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        id="exampleEmail"
                                        placeholder="with a placeholder"/>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="examplePassword">Name</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="examplePassword"
                                        placeholder="password placeholder"/>
                                </FormGroup>
                            </Form>

                            <Card>
                                <CardHeader>Title</CardHeader>
                                <CardBody>

                                        <ListGroup>
                                            {
                                                markerObjects.map( (item,index) => {
                                                    return <ListGroupItem key={index} 

                                                    onClick={
                                                        ()=>{
                                                            this.props.google.maps.event.trigger(item,'click')
                                                    }
                                                    }

                                                    onMouseOver={
                                                        ()=>{
                                                            this.props.google.maps.event.trigger(item,'mouseover')
                                                    }
                                                    }

                                                    onMouseOut={
                                                        ()=>{
                                                            this.props.google.maps.event.trigger(item,'mouseout')
                                                        }
                                                    }

                                                    >{item.getPosition().lat()} - {item.getPosition().lng()}</ListGroupItem>
                                                })
                                            }

                                        </ListGroup>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        );
    }
}

export default GoogleApiWrapper({apiKey: ('AIzaSyAiQX1yfcvHCeM98e6asi-Wi-Y_H4-V1Qw')})(App);
