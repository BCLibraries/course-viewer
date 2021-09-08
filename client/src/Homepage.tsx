import * as React from 'react';
import './Homepage.css'

import {Redirect} from "react-router";
import CourseSearchForm from "./CourseSearchForm";
import LoginPage from "./LoginPage";
import SectionList from "./Schedule/SectionList";
import Semester from "./Semester";
import {UserType} from "./Types/UserType";
import SetUserCallbackInterface from "./Interfaces/SetUserCallbackInterface";

type HomepageProps = {
    user: UserType | null,
    setUser: SetUserCallbackInterface,
    redirectUrl: string | null
}

const currentSemester = Semester.currentSemester();

function Homepage({user, setUser, redirectUrl}: HomepageProps) {

    if (redirectUrl && user) {
        return <Redirect to={redirectUrl}/>
    }

    return (
        <div>
            <h2 className="course-name">Course reserves</h2>
            <div className="col-md-12">
                <div className="homepage-forms">

                    {user ?
                        <h3>Your {currentSemester.displaySemester} {currentSemester.displayYear} courses</h3>
                        :
                        <h3>Find your readings</h3>}

                    {user ?

                        // Logged in user? Display their courses.
                        <SectionList
                            sections={user.sections._sectionsAsInstructor.concat(user.sections._sectionsAsStudent)}
                            uid={user.uid}
                        />
                        :
                        // Otherwise, prompt for login
                        <LoginPage setUser={setUser}/>
                    }

                    {user && <div className="form-or">or</div>}

                    {user && <CourseSearchForm/>}
                </div>
            </div>
        </div>
    );
}

export default Homepage;