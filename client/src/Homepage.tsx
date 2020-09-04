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
            <div className="col-md-7">
                <div className="about-reserves">
                    <div className="s-lib-box-content">

                        <h3>About course reserves</h3>
                        <div id="s-lg-content-37794915" className="clearfix">
                            <p>All the libraries at Boston College provide course reserves support. Please
                                select a library to access detailed information about their Course Reserves
                                services.</p>

                            <ul>
                                <li>
                                    <a href="https://libguides.bc.edu/bapst/course-reserves">Bapst Library</a> (Fine
                                    Arts)
                                </li>
                                <li><a href="https://libguides.bc.edu/erc/course-reserves">Educational Resource
                                    Center</a> (K-12 curriculum)
                                </li>
                                <li>
                                    <a href="https://www.bc.edu/bc-web/schools/law/sites/current-students/library/using/faculty-services.html#courses">Law
                                        Library</a> (Law School)
                                </li>
                                <li><a href="https://libguides.bc.edu/course-reserves-oneill">O'Neill
                                    Library</a> (Arts &amp; Sciences, Education, Management, Nursing, Woods
                                    College)
                                </li>
                                <li><a href="https://libguides.bc.edu/socialwork/course-reserves">Social Work
                                    Library</a> (School of Social Work)
                                </li>
                                <li><a href="https://libguides.bc.edu/tml/reserves">Theology and Ministry
                                    Library</a> (School of Theology &amp; Ministry)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-5">
                <div className="homepage-forms">

                    {user ?
                        <h3>Your {currentSemester.displaySemester} {currentSemester.displayYear} courses</h3>
                        :
                        <h3>Find your readings</h3>}

                    {user ?

                        // Logged in user? Display their courses.
                        <SectionList sections={user.sections._sectionsAsStudent}/>
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