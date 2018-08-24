import * as React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';

import CourseDisplay from "./CourseDisplay";
import Homepage from './Homepage';

const alternateBase = '/reserves';

class App extends React.Component<{}, { user: any }> {
    public constructor(props: any) {
        super(props);
        this.state = {user: null};
    }


    public render() {
        const setUser = (user:any) => {this.setState({user})};

        const homepageRender = (props: any) => <Homepage user={this.state.user} setUser={setUser}/>;

        return (
            <BrowserRouter basename={process.env.REACT_APP_CLIENT_BASE}>
                <div>
                    <Route exact={true} path={`${alternateBase}/`} render={homepageRender}/>
                    <Route exact={true} path={`${process.env.PUBLIC_URL}/`} render={homepageRender}/>

                    <Route path={`${alternateBase}/:course_id/section/:section_id`} component={CourseDisplay}/>
                    <Route path={`${process.env.PUBLIC_URL}/:course_id/section/:section_id`} component={CourseDisplay}/>

                    <Route path={`${alternateBase}/course/:course_id/section/:section_id`} component={CourseDisplay}/>
                    <Route path={`${process.env.PUBLIC_URL}/course/:course_id/section/:section_id`} component={CourseDisplay}/>

                    <Route path={`${alternateBase}/lti`} component={CourseDisplay}/>
                    <Route path={`${process.env.PUBLIC_URL}/lti`} component={CourseDisplay}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
