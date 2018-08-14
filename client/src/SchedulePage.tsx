import * as React from 'react';
import {Redirect} from "react-router";
import './SchedulePage.css';
import SectionList from './SectionList';

class SchedulePage extends React.Component<{ location: any }, {}> {
    public render() {
        if (! this.props.location.state || ! this.props.location.state.user) {
           return <Redirect to={"/"}/>
        }


        return (<div>
            <SectionList sections={this.props.location.state.user.sections._sectionsAsStudent}/>
        </div>);
    }
}

export default SchedulePage;