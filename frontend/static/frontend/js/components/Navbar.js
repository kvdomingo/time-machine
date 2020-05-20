import React, { Component } from 'react';
import {
    MDBNavbar as Navbar,
    MDBNavbarBrand as NavbarBrand,
    MDBNavbarNav as NavbarNav,
    MDBNavItem as NavItem,
    MDBNavLink as NavLink,
    MDBNavbarToggler as NavbarToggler,
    MDBCollapse as Collapse,
} from 'mdbreact';
import { Image } from 'cloudinary-react';


export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    toggleCollapse = () => {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }))
    }

    render() {
        return (
            <Navbar color='white' light expand='md' style={{ boxShadow: 'none' }}>
                <NavbarBrand>
                    <Image
                        cloudName='kdphotography-assets'
                        publicId='time-machine/logo'
                        secure
                        responsive
                        responsiveUseBreakpoints
                        height='30'
                        />
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleCollapse} />
                <Collapse id='navbar' isOpen={this.state.isOpen} navbar>
                    <NavbarNav right>
                        <NavItem>
                            <NavLink to='/'>{this.props.username}</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to='' onClick={this.props.handleLogout}>Logout</NavLink>
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        );
    }
}
