import React, { Component } from 'react';
import {
    MDBCard as Card,
    MDBCardHeader as CardHeader,
    MDBCardBody as CardBody,
} from 'mdbreact';
import { Pie } from 'react-chartjs-2';
import 'chartjs-plugin-colorschemes';


export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPie: {
                labels: Object.keys(this.props.stats),
                datasets: [
                    { data: Object.values(this.props.stats) },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    colorschemes: { scheme: 'tableau.Tableau20' },
                },
            },
        };
    }

    render() {
        return (
            <Card style={{ boxShadow: 'none', border: '1px solid rgb(224, 224, 224)' }}>
                <CardHeader>Time spent in hours per tag</CardHeader>
                <CardBody>
                    <Pie
                        data={this.state.dataPie}
                        options={this.state.options}
                        />
                </CardBody>
            </Card>
        );
    }
}
