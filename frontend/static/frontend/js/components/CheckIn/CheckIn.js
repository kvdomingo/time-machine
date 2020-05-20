import React, { Component } from 'react';
import {
    MDBContainer as Container,
    MDBBtn as Button,
    MDBIcon as Icon,
    MDBListGroup as ListGroup,
    MDBRow as Row,
    MDBCol as Col,
} from 'mdbreact';
import AddModal from './AddModal';
import CheckInList from './CheckInList';
import Stats from '../Stats/Stats';
import Loading from '../Loading';
import dateFormat from 'dateFormat';
import Cookies from 'js-cookie';
import '../App.css'


export default class CheckIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: '',
            tag: '',
            activities: '',
            checkIns: [],
            stats: {},
            isLoaded: false,
            addDialogOpen: false,
        };
    }

    componentDidMount() {
        this.fetchCheckIns();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.checkIns.length !== this.state.checkIns.length) {
            this.fetchCheckIns();
        }
    }

    fetchCheckIns = () => {
        fetch('/api/checkins', {
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
            },
        })
            .then(res => res.json())
            .then(checkIns => {
                checkIns = [ ...checkIns ]
                let stats = {};
                checkIns.forEach((checkIn, i) => {
                    let date = new Date(checkIn.created)
                    checkIn.date = date;
                    checkIn.displayDate = dateFormat(date, 'dd mmm yyyy');
                    stats[checkIn.tag] = (stats[checkIn.tag])
                        ? stats[checkIn.tag] + checkIn.duration
                        : checkIn.duration;
                });
                this.setState({ checkIns, stats, isLoaded: true })
            });
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    addCheckIn = (e, data) => {
        e.preventDefault();
        fetch('/api/checkins', {
            method: 'POST',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            body: JSON.stringify({
                duration: data.duration,
                tag: data.tag,
                activities: data.activities,
                author: this.state.checkIns[0].author,
            }),
        })
            .then(res => res.json())
            .then(data => this.fetchCheckIns());
        this.clearForm();
    }

    deleteCheckIn = (e, id) => {
        fetch('/api/checkins', {
            method: 'DELETE',
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        })
            .then(res => res.json())
            .then(data => this.fetchCheckIns());
    }

    clearForm = (e) => {
        this.setState({
            duration: '',
            tag: '',
            activities: '',
        });
        this.toggleModal();
    }

    toggleModal = () => {
        this.setState(prevState => ({ addDialogOpen: !prevState.addDialogOpen }));
    }

    render() {
        if (!this.state.isLoaded) return <Loading />;
        else return (
            <Container className='my-5'>
                <Button color='primary' className='mx-0' style={{ boxShadow: 'none' }} onClick={this.toggleModal}>
                    <Icon fas icon='plus' className='mr-2' />Check-in
                </Button>
                <Row>
                    <Col>
                        <AddModal
                            toggleModal={this.toggleModal}
                            handleChange={this.handleChange}
                            addCheckIn={this.addCheckIn}
                            clearForm={this.clearForm}
                            {...this.state}
                            />
                        <ListGroup>
                            <CheckInList
                                deleteCheckIn={this.deleteCheckIn}
                                {...this.state}
                                />
                        </ListGroup>
                    </Col>
                    <Col>
                        <Stats {...this.state} />
                    </Col>
                </Row>
            </Container>
        );
    }
}
