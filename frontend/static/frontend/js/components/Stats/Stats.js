import React, { Component } from 'react';
import {
    MDBCard as Card,
    MDBCardHeader as CardHeader,
    MDBCardBody as CardBody,
    MDBCardFooter as CardFooter,
    MDBNav as Nav,
    MDBNavItem as NavItem,
    MDBNavLink as NavLink,
} from 'mdbreact';
import dateFormat from 'dateformat';
import Loading from '../Loading';
import { Pie } from 'react-chartjs-2';
import 'chartjs-plugin-colorschemes';
import PropTypes from 'prop-types';


export default class Stats extends Component {
    static propTypes = {
        checkIns: PropTypes.array.isRequired,
    }

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
            // update barrier to prevent infinite update loop
            this.updateStats(this.props.checkIns);
        }
    }

    updateStats = (checkIns) => {
        let stats = {};
        let now = new Date();

        function millisToDays(ms) {
            // ms/s/min/hr/day
            return ms/1000/60/60/24
        }

        function condition(select, now, prev) {
            /* condition selector for information to display on pie chart
            depending on selected time period */
            if (select === 'all-time') {
                return true;
            } else if (select === 'month') {
                return (dateFormat(now, 'yyyy-mm') === dateFormat(prev.date, 'yyyy-mm'));
            } else if (select === 'week') {
                return (millisToDays(now.getTime()) - millisToDays(prev.date.getTime()) <= 7);
            } else if (select === 'day') {
                return (dateFormat(now, 'yyyy-mm-dd') === dateFormat(prev.date, 'yyyy-mm-dd'));
            }
        }

        checkIns.forEach((checkIn, i) => {
            if (condition(this.state.statSelector, now, checkIn)) {
                /* If tag exists in the stats object, add the corresponding
                duration. If not, create the tag and initialize it with the
                duration of the current tag */
                stats[checkIn.tag] = (stats[checkIn.tag])
                    ? stats[checkIn.tag] + checkIn.duration
                    : checkIn.duration;
            }
        });

        this.setState({ stats, isLoaded: true });
        this.chartUpdate(this.state.stats);
    }

    chartUpdate = (stats) => {
        // trigger chart redraw
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
        // pie chart time period selector
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
