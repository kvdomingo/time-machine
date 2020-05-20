import React, { Component } from 'react';
import {
    MDBTypography as Typography,
} from 'mdbreact';


export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            <form onSubmit={(e) => {this.props.handleLogin(e, this.state)}}>
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
                {(this.props.loginError)
                    ? <div className='text-danger my-3'>Invalid login credentials</div>
                    : null
                }
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
