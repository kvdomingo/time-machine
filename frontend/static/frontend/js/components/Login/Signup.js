import React, { Component } from 'react';
import {
    MDBTypography as Typography,
} from 'mdbreact';


export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
        };
    }

    handleChange = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <form onSubmit={(e) => {this.props.handleSignup(e, this.state)}}>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='text'
                        name='email'
                        className='form-control'
                        value={this.state.email}
                        onChange={this.handleChange}
                        />
                </div>
                <div className='form-group'>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        name='username'
                        className='form-control'
                        value={this.state.username}
                        onChange={this.handleChange}
                        />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        name='password'
                        className='form-control'
                        value={this.state.password}
                        onChange={this.handleChange}
                        />
                </div>
                <input
                    type='submit'
                    name='submit'
                    value='Submit'
                    className='btn btn-primary'
                    />
            </form>
        );
    }
}
