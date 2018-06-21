import * as React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';

import CourseDisplay from "./CourseDisplay";

class App extends React.Component {
    public render() {
        return (
            <BrowserRouter basename={process.env.REACT_APP_CLIENT_BASE}>
                <div>
                    <Route path={`${process.env.PUBLIC_URL}/course/:course_id/section/:section_id`} component={CourseDisplay}/>
                    <Route path={`${process.env.PUBLIC_URL}/lti`} component={CourseDisplay} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
