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
            validEmail: true,
            validPassword: true,
        };
    }

    handleChange = e => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }

    validateEmail = e => {
        this.handleChange(e);
        let { value } = e.target;
        let emailExp = /^\w+@[a-zA-Z_]+?(\.[a-zA-Z]+)+$/g;
        let validEmail = emailExp.test(value);
        this.setState({ validEmail });
    }

    validatePassword = e => {
        this.handleChange(e);
        let { value } = e.target;
        let passExp = /^.{8,}$/g;
        let validPassword = passExp.test(value);
        this.setState({ validPassword });
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
                        onChange={this.validateEmail}
                        />
                    {(this.state.validEmail)
                        ? null
                        : <div className='text-danger'>Please use a valid email</div>
                    }
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
                        onChange={this.validatePassword}
                        />
                    {(this.state.validPassword)
                        ? null
                        : <div className='text-danger'>Password must be at least 8 characters long</div>
                    }
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
