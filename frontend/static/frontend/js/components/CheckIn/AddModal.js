import React, { Component } from 'react';
import {
    MDBModal as Modal,
    MDBModalHeader as ModalHeader,
    MDBModalBody as ModalBody,
    MDBModalFooter as ModalFooter,
    MDBIcon as Icon,
    MDBBtn as Button,
} from 'mdbreact';


export default class AddModal extends Component {
    render() {
        return (
            <Modal isOpen={this.props.addDialogOpen} toggle={this.props.toggleModal}>
                <ModalHeader toggle={this.props.toggleModal}>Add check-in</ModalHeader>
                <ModalBody>
                    <form>
                        <div className='form-group'>
                            <input
                                type='number'
                                name='duration'
                                placeholder='Duration (hours)'
                                onChange={this.props.handleChange}
                                value={this.props.duration}
                                className='form-control'
                                />
                        </div>
                        <div className='input-group'>
                            <div className='input-group-prepend'>
                                <span className='input-group-text' id='basic-addon'>
                                    <Icon fas icon='hashtag' />
                                </span>
                            </div>
                            <input
                                type='text'
                                name='tag'
                                placeholder='Tag'
                                onChange={this.props.handleChange}
                                value={this.props.tag}
                                className='form-control'
                                aria-describedby='basic-addon'
                                />
                        </div>
                        <div className='form-group mt-3'>
                            <input
                                type='text'
                                name='activities'
                                placeholder='Activities'
                                onChange={this.props.handleChange}
                                value={this.props.activities}
                                className='form-control'
                                />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={(e) => this.props.addCheckIn(e, this.props)}>Add</Button>
                    <Button color='blue-grey' onClick={this.props.clearForm}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
