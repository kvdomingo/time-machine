import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
    MDBContainer as Container,
} from 'mdbreact';
import Cookies from 'js-cookie';
import Loading from './Loading';
import Navbar from './Navbar';
import Form from './Login/Form';
import CheckIn from './CheckIn';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            username: '',
        };
    }

    componentDidMount() {
        if (this.state.loggedIn) {
            fetch('/api/auth/current-user', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`,
                },
            })
                .then(res => res.json())
                .then(data => this.setState({ username: data.username }));
        }
    }

    handleLogin = (e, data) => {
        e.preventDefault();
        fetch('/api/auth/token-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('token', data.token);
                this.setState({
                    loggedIn: true,
                    username: data.user.username,
                });
            });
    }

    handleSignup = (e, data) => {
        e.preventDefault();
        const csrftoken = Cookies.get('csrftoken');
        fetch('/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('token', data.token);
                this.setState({
                    loggedIn: true,
                    username: data.username,
                });
            });
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        this.setState({ loggedIn: false, username: '' });
    }

    render() {
        return (
            <Router>
                <Suspense fallback={<Loading />}>
                    {(!this.state.loggedIn)
                        ? <Container className='my-5 mt-5'>
                            <Form
                                handleLogin={this.handleLogin}
                                handleSignup={this.handleSignup}
                                handleLogout={this.handleLogout}
                                {...this.state}
                                />
                        </Container>
                        : <React.Fragment>
                            <Navbar handleLogout={this.handleLogout} />
                            <CheckIn />
                        </React.Fragment>
                    }
                </Suspense>
            </Router>
        );
    }
}
