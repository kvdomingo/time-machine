import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
    MDBContainer as Container,
} from 'mdbreact';
import Cookies from 'js-cookie';
import Loading from './Loading';
import Navbar from './Navbar';
import Form from './Login/Form';
import CheckIn from './CheckIn/CheckIn';
import Http404 from './Http404';
import './App.css';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            username: '',
            loginError: false,
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
                .then(data => {
                    data = { ...data };
                    if (data.detail === 'Signature has expired.') this.setState({ loggedIn: false });
                    else this.setState({ username: data.username });
                });
        }
    }

    resetLogin = () => {
        this.setState({ loginError: false });
    }

    handleLogin = (e, data) => {
        e.preventDefault();
        fetch('/api/auth/token-auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
            })
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('token', data.token);
                this.setState({
                    loggedIn: true,
                    username: data.user.username,
                });
            })
            .catch(err => this.setState({ loginError: true }));
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
                    <Switch>
                        <Route exact path='/'>
                            {(!this.state.loggedIn)
                                ? <Container className='my-5 mt-5'>
                                    <Form
                                        handleLogin={this.handleLogin}
                                        handleSignup={this.handleSignup}
                                        handleLogout={this.handleLogout}
                                        resetLogin={this.resetLogin}
                                        {...this.state}
                                        />
                                </Container>
                                : <React.Fragment>
                                    <Navbar handleLogout={this.handleLogout} {...this.state} />
                                    <CheckIn {...this.state} />
                                </React.Fragment>
                            }
                        </Route>
                        <Route component={Http404} status={404} />
                    </Switch>
                </Suspense>
            </Router>
        );
    }
}
