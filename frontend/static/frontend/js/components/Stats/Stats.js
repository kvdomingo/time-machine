import React, { Component } from 'react';
import {
    MDBCard as Card,
    MDBCardHeader as CardHeader,
    MDBCardBody as CardBody,
    MDBCardFooter as CardFooter,
    MDBTabPane as TabPane,
    MDBTabContent as TabContent,
    MDBNav as Nav,
    MDBNavItem as NavItem,
    MDBNavLink as NavLink,
} from 'mdbreact';
import Loading from '../Loading';
import { Pie } from 'react-chartjs-2';
import 'chartjs-plugin-colorschemes';


export default class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statSelector: 'day',
            stats: {},
            isLoaded: false,
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
        this.updateStats(this.props.checkIns);
    }

    componentDidUpdate(prevProps, prevState) {
        function sum(arr) {
            return (arr.reduce((a, b) => a + b, 0));
        }

        if (sum(Object.values(this.state.stats)) !== sum(Object.values(prevState.stats))
            || this.props.checkIns.length !== prevProps.checkIns.length
            || this.state.statSelector !== prevState.statSelector) {
            this.updateStats(this.props.checkIns);
        }
    }

    updateStats = (checkIns) => {
        let stats = {};
        let now = new Date();

        function millisToDays(ms) {
            return ms/1000/60/60/24
        }

        function condition(select, now, prev) {
            if (select === 'all-time') {
                return true;
            } else if (select === 'month') {
                return (prev.date.getMonth() === now.getMonth() && prev.date.getFullYear() === now.getFullYear());
            } else if (select === 'week') {
                return (millisToDays(now.getTime()) - millisToDays(prev.date.getTime()) <= 7);
            } else if (select === 'day') {
                return (now.getDay() === prev.date.getDay());
            }
        }

        checkIns.forEach((checkIn, i) => {
            if (condition(this.state.statSelector, now, checkIn)) {
                stats[checkIn.tag] = (stats[checkIn.tag])
                    ? stats[checkIn.tag] + checkIn.duration
                    : checkIn.duration;
            }
        });

        this.setState({ stats, isLoaded: true });
        this.chartUpdate(this.state.stats);
    }

    chartUpdate = (stats) => {
        this.setState({
            dataPie: {
                labels: Object.keys(stats),
                datasets: [
                    { data: Object.values(stats) },
                ],
            },
        });
    }

    togglePills = (tab) => e => {
        e.preventDefault();
        this.setState({ statSelector: tab });
    }

    render() {
        let statSelector = ['day', 'week', 'month', 'all-time'];
        if (!this.state.isLoaded) return <Loading />;
        else return (
            <Card style={{ boxShadow: 'none', border: '1px solid rgb(224, 224, 224)' }}>
                <CardHeader>Time spent per tag (in hours)</CardHeader>
                <CardBody>
                    {(Object.keys(this.state.stats).length > 0)
                        ? <Pie
                            ref={this.chartRef}
                            data={this.state.dataPie}
                            height={200}
                            options={this.state.options}
                            />
                        : <div className='text-center text-muted'>
                            No check-ins for the selected time period
                        </div>
                    }
                </CardBody>
                <CardFooter>
                    <Nav className='nav-pills'>
                        {statSelector.map((sel, i) => (
                            <NavItem key={sel}>
                                <NavLink
                                    link
                                    to=''
                                    active={this.state.statSelector === sel}
                                    onClick={this.togglePills(sel)}
                                    >
                                    {sel}
                                </NavLink>
                            </NavItem>
                        ))}
                    </Nav>
                </CardFooter>
            </Card>
        );
    }
}
