import * as React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';

import CourseDisplay from "./CourseDisplay";
import LoginPage from "./LoginPage";
import SchedulePage from './SchedulePage';

class App extends React.Component {
    public render() {
        return (
            <BrowserRouter basename={process.env.REACT_APP_CLIENT_BASE}>
                <div>
                    <Route path={`${process.env.PUBLIC_URL}/:course_id/section/:section_id`} component={CourseDisplay}/>
                    <Route path={`${process.env.PUBLIC_URL}/course/:course_id/section/:section_id`} component={CourseDisplay}/>
                    <Route path={`${process.env.PUBLIC_URL}/lti`} component={CourseDisplay} />
                    <Route exact={true} path={`${process.env.PUBLIC_URL}/`} component={LoginPage}/>
                    <Route exact={true} path={`${process.env.PUBLIC_URL}/schedule`} component={SchedulePage} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
