import React, { Component } from 'react';
import {
    MDBModal as Modal,
    MDBModalHeader as ModalHeader,
    MDBModalBody as ModalBody,
    MDBModalFooter as ModalFooter,
    MDBIcon as Icon,
    MDBBtn as Button,
} from 'mdbreact';
import PropTypes from 'prop-types';


export default class AddModal extends Component {
    static propTypes = {
        activities: PropTypes.string.isRequired,
        addCheckIn: PropTypes.func.isRequired,
        clearForm: PropTypes.func.isRequired,
        duration: PropTypes.number.isRequired,
        handleChange: PropTypes.func.isRequired,
        modalOpen: PropTypes.bool.isRequired,
        tag: PropTypes.string.isRequired,
        toggleModal: PropTypes.func.isRequired,
        validDuration: PropTypes.bool.isRequired,
        validateDuration: PropTypes.func.isRequired,
        validTag: PropTypes.bool.isRequired,
        validateTag: PropTypes.func.isRequired,
    }

    render() {
        return (
            <Modal isOpen={this.props.modalOpen} toggle={this.props.toggleModal}>
                <ModalHeader toggle={this.props.toggleModal}>Check-in</ModalHeader>
                <ModalBody>
                    <form>
                        <div className='form-group'>
                            <input
                                type='number'
                                name='duration'
                                placeholder='Duration (hours)'
                                onChange={this.props.validateDuration}
                                value={this.props.duration}
                                className='form-control'
                                />
                            {(this.props.validDuration)
                                ? null
                                : <div className='text-danger'>
                                    Duration must be a number.
                                </div>
                            }
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
                                onChange={this.props.validateTag}
                                value={this.props.tag}
                                className='form-control'
                                aria-describedby='basic-addon'
                                />
                        </div>
                        {(this.props.validTag)
                            ? null
                            : <div className='text-danger'>
                                Tags must not contain spaces.
                            </div>
                        }
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
