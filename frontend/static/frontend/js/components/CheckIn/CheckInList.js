import React, { Component } from 'react';
import {
    MDBBtn as Button,
    MDBIcon as Icon,
    MDBListGroupItem as ListGroupItem,
} from 'mdbreact';
import '../App.css';


export default class CheckInList extends Component {
    render() {
        return (
            this.props.checkIns.map((checkIn, i) => (
                <React.Fragment>
                    {(i === 0)
                        ? <li className='list-group-item blue-grey lighten-5' key='today'>
                            <b>{checkIn.displayDate}</b>
                        </li>
                        : null
                    }
                    {(i > 0 && checkIn.displayDate !== this.props.checkIns[i-1].displayDate)
                        ? <li className='list-group-item blue-grey lighten-5' key={`date-${i}`}>
                            <b>{checkIn.displayDate}</b>
                        </li>
                        : null
                    }
                    <ListGroupItem className='d-flex justify-content-between align-items-center' key={checkIn.id}>
                        {checkIn.duration} {(parseFloat(checkIn.duration) === 1) ? 'hr' : 'hrs'} #{checkIn.tag} {checkIn.activities}
                        <Button
                            color='white'
                            className='text-muted p-0 mr-md-2 text-align-right'
                            onClick={(e) => this.props.deleteCheckIn(e, checkIn.id)}
                            style={{ boxShadow: 'none' }}
                            >
                            <Icon fas icon='trash-alt' />
                        </Button>
                    </ListGroupItem>
                </React.Fragment>
            ))
        );
    }
}
