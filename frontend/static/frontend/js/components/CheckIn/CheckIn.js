import React, { Component } from 'react';
import {
    MDBContainer as Container,
    MDBBtn as Button,
    MDBIcon as Icon,
    MDBListGroup as ListGroup,
    MDBListGroupItem as ListGroupItem,
    MDBTypography as Typography,
    MDBRow as Row,
    MDBCol as Col,
} from 'mdbreact';
import AddModal from './AddModal';
import CheckInList from './CheckInList';
import Stats from '../Stats/Stats';
import Loading from '../Loading';
import dateFormat from 'dateformat';
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
            isLoaded: false,
            modalOpen: false,
            validTag: true,
            validDuration: true,
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
                checkIns.forEach((checkIn, i) => {
                    let date = new Date(checkIn.created)
                    checkIn.date = date;
                    checkIn.displayDate = dateFormat(date, 'dd mmm yyyy');
                });
                this.setState({ checkIns, isLoaded: true })
            });
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    createUpdateCheckIn = (e, data) => {
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
                author: this.props.userId,
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
            validTag: true,
            validDuration: true,
        });
        this.toggleModal();
    }

    toggleModal = (e) => {
        this.setState(prevState => ({ modalOpen: !prevState.modalOpen }));
    }

    validateTag = (e) => {
        this.handleChange(e);
        let { value } = e.target;
        let tagExp = /^\S*$/g;
        let validTag = tagExp.test(value);
        this.setState({ validTag });
    }

    validateDuration = (e) => {
        this.handleChange(e);
        let { value } = e.target;
        let durExp = /^\d+(\.\d+)?$/g;
        let validDuration = durExp.test(value);
        this.setState({ validDuration });
    }

    render() {
        if (!this.state.isLoaded) return <Loading />;
        else return (
            <Container className='my-5'>
                <Typography tag='h2' variant='display-4'>Welcome, {this.props.firstName}!</Typography>
                <Typography tag='h3' variant='h4-responsive'>Today is {dateFormat(this.state.date, 'dddd, d mmmm yyyy')}.</Typography>
                <Button color='primary' className='mx-0 mt-5' style={{ boxShadow: 'none' }} onClick={this.toggleModal}>
                    <Icon fas icon='plus' className='mr-2' />Check-in
                </Button>
                <Row>
                    <Col className='mb-4'>
                        <AddModal
                            toggleModal={this.toggleModal}
                            handleChange={this.handleChange}
                            validateTag={this.validateTag}
                            validateDuration={this.validateDuration}
                            addCheckIn={this.addCheckIn}
                            clearForm={this.clearForm}
                            {...this.state}
                            />
                        <ListGroup>
                            {(this.state.checkIns.length > 0)
                                ? <CheckInList
                                    deleteCheckIn={this.deleteCheckIn}
                                    {...this.state}
                                    />
                                : <ListGroupItem
                                    className='blue-grey lighten-5 text-center'
                                    >
                                    You don't have any check-ins yet. Get started by clicking the button above.
                                </ListGroupItem>
                            }
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
