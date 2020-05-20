import React, { Component } from 'react';


export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            repeatPassword: '',
            validEmail: true,
            validPassword: true,
            validRepeatPassword: true,
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

    validateRepeatPassword = e => {
        this.handleChange(e);
        let { value } = e.target;
        let validRepeatPassword = (this.state.password === value);
        this.setState({ validRepeatPassword });
    }

    render() {
        return (
            <form onSubmit={(e) => {this.props.handleSignup(e, this.state)}}>
                <div className='form-group'>
                    <label htmlFor='username'>First name</label>
                    <input
                        type='text'
                        name='firstName'
                        className='form-control'
                        value={this.state.firstName}
                        onChange={this.handleChange}
                        required
                        />
                </div>
                <div className='form-group'>
                    <label htmlFor='username'>Last name</label>
                    <input
                        type='text'
                        name='lastName'
                        className='form-control'
                        value={this.state.lastName}
                        onChange={this.handleChange}
                        required
                        />
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='text'
                        name='email'
                        className='form-control'
                        value={this.state.email}
                        onChange={this.validateEmail}
                        required
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
                        required
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
                        required
                        />
                    {(this.state.validPassword)
                        ? null
                        : <div className='text-danger'>Password must be at least 8 characters long</div>
                    }
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Repeat password</label>
                    <input
                        type='password'
                        name='repeatPassword'
                        className='form-control'
                        value={this.state.repeatPassword}
                        onChange={this.validateRepeatPassword}
                        required
                        />
                    {(this.state.validRepeatPassword)
                        ? null
                        : <div className='text-danger'>Passwords do not match</div>
                    }
                </div>
                {(this.props.loginErrorInfo)
                    ? <div className='text-danger'>
                        {this.props.loginErrorInfo}
                    </div>
                    : null
                }
                <input
                    type='submit'
                    name='submit'
                    value='Submit'
                    className='btn btn-primary ml-0'
                    />
            </form>
        );
    }
}
