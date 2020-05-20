import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
    MDBContainer as Container,
} from 'mdbreact';
import Cookies from 'js-cookie';
import Loading from './Loading';
import Form from './Login/Form';
import './App.css';

const Navbar = lazy(() => import('./Navbar'));
const CheckIn = lazy(() => import('./CheckIn/CheckIn'));
const Http404 = lazy(() => import('./Http404'));


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            username: '',
            userId: '',
            firstName: '',
            lastName: '',
            loginError: false,
            loginErrorInfo: '',
        };
        this.loggedOutState = { ...this.state, loggedIn: false };
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
                    if (data.detail === 'Signature has expired.') this.resetLogin();
                    else this.setState({
                        loggedIn: true,
                        username: data.username,
                        userId: data.id,
                        firstName: data.first_name,
                        lastName: data.last_name,
                    });
                });
        }
    }

    resetLogin = () => {
        localStorage.removeItem('token');
        this.setState({ ...this.loggedOutState });
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
                password: data.password,
            })
        })
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('token', data.token);
                this.setState({
                    loggedIn: true,
                    username: data.user.username,
                    userId: data.user.id,
                    firstName: data.user.first_name,
                    lastName: data.user.last_name,
                });
            })
    }

    handleSignup = (e, data) => {
        e.preventDefault();
        if (!data.validRepeatPassword) return false;
        const csrftoken = Cookies.get('csrftoken');
        fetch('/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                email: data.email,
                username: data.username,
                password: data.password,
                first_name: data.firstName,
                last_name: data.lastName,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.username[0] === 'A user with that username already exists.') throw data.username[0];
                localStorage.setItem('token', data.token);
                this.setState({
                    loggedIn: true,
                    username: data.username,
                    userId: data.userId,
                    firstName: data.first_name,
                    lastName: data.last_name,
                });
            })
            .catch(err => this.setState({ loginErrorInfo: err }));
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        this.setState({ ...this.loggedOutState });
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
