import * as React from 'react';
import {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';
import UserStorage from './UserStorage';
import Homepage from './Homepage';
import CourseDisplayContainer from "./CourseDisplayContainer";
import LogoutButton from "./LogoutButton";
import {IN_IFRAME} from "./InIFrame";

const alternateBase = '/reserves';

function App() {
    const [user, setUser] = useState(seedUser());

    function storeNewUser(newUser: any) {
        try {
            UserStorage.store(newUser);
        } catch (e) {
            // no-op
        }
        setUser(newUser);
    }

    const redirect = UserStorage.getReturnUrl();
    const homepageRender = (props: any) =>
        <Homepage user={user} setUser={storeNewUser} redirectUrl={redirect}/>;
    const courseRender = (props: any) => <CourseDisplayContainer {...props} user={user}/>;

    return (
        <BrowserRouter basename={process.env.REACT_APP_CLIENT_BASE}>
            <div>
                {!IN_IFRAME && <LogoutButton user={user} setUser={storeNewUser}/>}

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

function seedUser() {
    try {
        return UserStorage.get();
    } catch (e) {
        return null;
    }
}

export default App;
