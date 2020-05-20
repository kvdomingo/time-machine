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
            dataPie: {},
            options: {
                layout: {
                    padding: 0,
                },
                plugins: {
                    colorschemes: { scheme: 'tableau.Tableau20' },
                },
                responsive: true,
            },
        };
        this.chartRef = React.createRef();
    }

    componentDidMount() {
        this.chartUpdate(this.props);
    }

    componentDidUpdate(prevProps, prevState) {
        function sum(arr) {
            return (arr.reduce((a, b) => a + b, 0));
        }

        if (sum(Object.values(this.props.stats)) !== sum(Object.values(prevProps.stats))) {
            this.chartUpdate(this.props);
        }
    }

    chartUpdate = (props) => {
        this.setState({
            dataPie: {
                labels: Object.keys(props.stats),
                datasets: [
                    { data: Object.values(props.stats) },
                ],
            },
        });
    }

    render() {
        return (
            <Card style={{ boxShadow: 'none', border: '1px solid rgb(224, 224, 224)' }}>
                <CardHeader>Time spent per tag (in hours)</CardHeader>
                <CardBody>
                    {(Object.keys(this.props.stats).length > 0)
                        ? <Pie
                            ref={this.chartRef}
                            data={this.state.dataPie}
                            height={200}
                            options={this.state.options}
                            />
                        : <div className='text-center text-muted'>
                            No data available
                        </div>
                    }
                </CardBody>
            </Card>
        );
    }
}
