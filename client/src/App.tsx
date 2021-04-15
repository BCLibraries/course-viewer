import * as React from 'react';
import {useState} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import './App.css';
import UserStorage from './Hooks/UserStorage';
import Homepage from './Homepage';
import CourseDisplayContainer from "./CourseDisplayContainer";
import LogoutButton from "./LogoutButton";
import {IN_IFRAME} from "./InIFrame";
import {UserType} from "./Types/UserType";
import ExpiredCourse from "./ExpiredCourse";

const alternateBase = '/reserves';

function App() {
    const [user, setUser] = useState(seedUser());

    function storeNewUser(newUser: UserType | null) {
        try {
            UserStorage.store(newUser);
        } catch (e) {
            newUser = null;
        }
        setUser(newUser);
    }

    const redirect = UserStorage.getReturnUrl();
    const homepageRender = (props: any) =>
        <Homepage user={user} setUser={storeNewUser} redirectUrl={redirect}/>;
    const courseRender = (props: any) => <CourseDisplayContainer {...props} user={user}/>;
    const expiredCourseRender =  (props: any) => <ExpiredCourse />;

    return (
        <BrowserRouter basename={process.env.REACT_APP_CLIENT_BASE}>
            <div>
                {!IN_IFRAME && <LogoutButton user={user} setUser={storeNewUser}/>}

                <Route exact={true} path={`${alternateBase}/`} render={homepageRender}/>
                <Route exact={true} path={`${process.env.PUBLIC_URL}/`} render={homepageRender}/>

                <Route exact={true} path={`${alternateBase}/expired`} render={expiredCourseRender}/>
                <Route exact={true} path={`${process.env.PUBLIC_URL}/expired`} render={expiredCourseRender}/>

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

function seedUser(): UserType | null {
    try {
        return UserStorage.get();
    } catch (e) {
        return null;
    }
}

export default App;
