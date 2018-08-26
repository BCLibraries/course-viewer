import * as React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';
import UserStorage from './UserStorage';


import CourseDisplay from "./CourseDisplay";
import Homepage from './Homepage';

const alternateBase = '/reserves';

class App extends React.Component<{}, { user: any }> {
    public constructor(props: any) {
        super(props);
        this.state = {user: UserStorage.get()};
    }


    public render() {
        const setUser = (user: any) => {
            UserStorage.store(user);
            this.setState({user})
        };

        const homepageRender = (props: any) => <Homepage user={this.state.user} setUser={setUser}/>;
        const courseRender = (props: any) => <CourseDisplay {...props} user={this.state.user}/>;

        return (
            <BrowserRouter basename={process.env.REACT_APP_CLIENT_BASE}>
                <div>
                    <Route exact={true} path={`${alternateBase}/`} render={homepageRender}/>
                    <Route exact={true} path={`${process.env.PUBLIC_URL}/`} render={homepageRender}/>

                    <Route path={`${alternateBase}/:course_id/section/:section_id`} render={courseRender}/>
                    <Route path={`${process.env.PUBLIC_URL}/:course_id/section/:section_id`} render={courseRender}/>

                    <Route path={`${alternateBase}/course/:course_id/section/:section_id`} render={courseRender}/>
                    <Route path={`${process.env.PUBLIC_URL}/course/:course_id/section/:section_id`} render={courseRender}/>

                    <Route path={`${alternateBase}/lti`} render={courseRender}/>
                    <Route path={`${process.env.PUBLIC_URL}/lti`} render={courseRender}/>

                    <div className="col-md-12 report-a-problem">Problems? <a href="mailto:reserves-ggroup@bc.edu">Send
                        us an email</a></div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
