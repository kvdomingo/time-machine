import React from 'react';
import {
    MDBContainer as Container,
    MDBTypography as Typography,
} from 'mdbreact';


export default function Http404() {
    return (
        <Container className='text-center my-5 mt-5'>
            <Typography tag='h1' variant='display-5'>
                That page was not found.
            </Typography>
        </Container>
    );
}
