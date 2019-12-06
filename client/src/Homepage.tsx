import * as React from 'react';
import './Homepage.css'

import {Redirect} from "react-router";
import CourseSearchForm from "./CourseSearchForm";
import LoginPage from "./LoginPage";
import SectionList from "./SectionList";

type HomepageProps = {
    user: any,
    setUser: any,
    redirectUrl: any
}

function Homepage({user, setUser, redirectUrl}: HomepageProps) {

    if (redirectUrl) {
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
                            <p>All&nbsp;the libraries at Boston College provide course reserves support.&nbsp;Please
                                select a library to access detailed information about their Course Reserves
                                services.&nbsp;</p>

                            <ul>
                                <li>
                                    <a href="https://libguides.bc.edu/bapst/course-reserves">Bapst&nbsp;Library</a>&nbsp;(Fine
                                    Arts)
                                </li>
                                <li><a href="https://libguides.bc.edu/erc/course-reserves">Educational Resource
                                    Center</a>&nbsp;(K-12 curriculum)
                                </li>
                                <li>
                                    <a href="https://www.bc.edu/bc-web/schools/law/sites/current-students/library/using/faculty-services.html#courses">Law
                                        Library</a>&nbsp;(Law School)
                                </li>
                                <li><a href="https://libguides.bc.edu/course-reserves-oneill">O'Neill
                                    Library</a>&nbsp;(Arts &amp; Sciences, Education, Management, Nursing, Woods
                                    College)
                                </li>
                                <li><a href="https://libguides.bc.edu/socialwork/course-reserves">Social Work
                                    Library</a>&nbsp;(School of Social Work)
                                </li>
                                <li><a href="https://libguides.bc.edu/tml/reserves">Theology and Ministry
                                    Library</a>&nbsp;(School of Theology &amp; Ministry)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-5">
                <div className="homepage-forms">

                    {user ? <h3>Your Fall 2019 courses</h3> : <h3>Find your readings</h3>}

                    {user ?

                        // Logged in user? Display their courses.
                        <SectionList sections={user.sections._sectionsAsStudent}/>
                        :
                        // Otherwise, prompt for login
                        <LoginPage user={user} setUser={setUser}/>
                    }

                    {user && <div className="form-or">or</div>}

                    {user && <CourseSearchForm/>}
                </div>
            </div>
        </div>
    );
}

export default Homepage;