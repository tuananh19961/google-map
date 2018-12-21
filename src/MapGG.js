import React, {Component} from 'react';
import MapWithAMarkerClusterer from './MapWithAMarkerClusterer';
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
        latitude: 16.036505,
        longitude: 108.218185
    }, {
        name: 'TDT',
        latitude: 16.037157,
        longitude: 108.216959
    }, {
        name: 'TXT',
        latitude: 16.037379,
        longitude: 108.217404
    }, {
        name: 'NTN',
        latitude: 16.035671,
        longitude: 108.217180
    }, {
        name: 'SPDN',
        latitude: 16.064964,
        longitude: 108.184093
    }
];

class MapGG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            u_position: {},
            listMarker : []
        }
    }

    componentDidMount() {
        // GET CURRENT LOCATION OF USER
        this.geoId = navigator
            .geolocation
            .getCurrentPosition((position) => {
                this.setState({u_position: position});
            }, (error) => {
                console.log(error)
            }, {
                timeout: 30000,
                enableHighAccuracy: true,
                maximumAge: 75000
            })

    }

    componentWillUnmount() {
        navigator
            .geolocation
            .clearWatch(this.geoId)
    }

    listMarker = (data) => {
        if(data){
            this.setState({
                listMarker: data
            })
        }
    }
    render() {
       
        return (
            <Container className="map">
                <Row>
                <Col xs="8">
                    <MapWithAMarkerClusterer
                        markers={positions}
                        currentLocation={this.state.u_position}
                        listMarker = {this.listMarker}
                        />
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
                                                this.state.listMarker.map( (item,index) => {
                                                    return <ListGroupItem key={index}

                                                    onClick={
                                                        ()=>{
                                                           
                                                    }
                                                    }

                                                    onMouseOver={
                                                        ()=>{
                                                          
                                                    }
                                                    }

                                                    onMouseOut={
                                                        ()=>{
                                                           
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

        );
    }
}

export default MapGG;