import React, { Component, lazy } from 'react';
import {
    MDBTypography as Typography,
    MDBCard as Card,
    MDBCardHeader as CardHeader,
    MDBCardBody as CardBody,
    MDBCardFooter as CardFooter,
} from 'mdbreact';
import { Image } from 'cloudinary-react';
import PropTypes from 'prop-types';

const Login = lazy(() => import('./Login'));
const Signup = lazy(() => import('./Signup'));


export default class Form extends Component {
    static propTypes = {
        handleLogin: PropTypes.func.isRequired,
        handleSignup: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            loginForm: true,
        };
    }

    toggleForm = () => {
        this.setState(prevState => ({ loginForm: !prevState.loginForm }));
        this.props.resetLogin();
    }

    render() {
        return (
            <div>
                <div className='text-center my-4'>
                    <Image
                        cloudName='kdphotography-assets'
                        publicId='time-machine/logo'
                        secure
                        height={70}
                        dpr='auto'
                        />
                </div>
                <Card style={{
                        boxShadow: 'none',
                        border: '1px solid rgb(224, 224, 224)'
                    }}
                    >
                    {(this.state.loginForm)
                        ? <React.Fragment>
                            <CardHeader>
                                <Typography tag='h1' variant='display-5'>Login</Typography>
                            </CardHeader>
                            <CardBody>
                                <Login {...this.props} />
                            </CardBody>
                            <CardFooter>
                                <a className='text-primary' onClick={this.toggleForm}>Sign up</a>
                            </CardFooter>
                        </React.Fragment>
                        : <React.Fragment>
                            <CardHeader>
                                <Typography tag='h1' variant='display-5'>Signup</Typography>
                            </CardHeader>
                            <CardBody>
                                <Signup {...this.props} />
                            </CardBody>
                            <CardFooter>
                                <a className='text-primary' onClick={this.toggleForm}>Login</a>
                            </CardFooter>
                        </React.Fragment>
                    }
                </Card>
            </div>
        );
    }
}
