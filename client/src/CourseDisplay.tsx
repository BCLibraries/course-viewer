import * as React from "react";
import {Redirect, Route} from "react-router";
import Client from "./Client";
import Course from "./Course";
import LibrarianBox from "./LibrarianBox";
import LibrariesHeader from "./LibrariesHeader";
import './Placeholder.css';
import ReadingList from "./ReadingList";
import ResearchGuidesBox from "./ResearchGuidesBox";

class CourseDisplay extends React.Component<{ match: any, user: any }, { course: Course, loading: boolean }> {
    public constructor(params: any) {
        super(params);
        this.state = {
            course: new Course,
            loading: false
        }
    }

    public async componentDidMount() {
        const params = this.props.match.params;
        const queryVars = parseQueryString();
        let course: Course;

        if (params.course_id && params.section_id) {
            params.course_id = params.course_id.toUpperCase();
            course = Course.buildFromCourseAndSection(params.course_id, params.section_id);
        } else if (queryVars.course_sis_id) {
            course = Course.buildFromId(queryVars.course_sis_id);
        } else {
            course = new Course;
        }

        document.title = `${course.subject}${course.number}-${course.section} resources - Boston College Libraries`;

        this.setState(prevState => {
            return {...prevState, course, loading: true}
        });

        await Client.fetchCourse(course);

        this.setState(prevState => {
            return {...prevState, course, loading: false}
        });
    }

    public render() {
        const classes: string[] = ['App'];
        const course = this.state.course;

        function inIframe() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }

        if (!inIframe() && !this.props.user) {
            return <Redirect push={true} to={{pathname: `${process.env.PUBLIC_URL}/`,}}/>
        }

        if (this.state.loading) {
            classes.push('loading');
        } else {
            classes.push('loaded');

            if (!this.state.course.hasReadings) {
                classes.push('no-readings');
            } else {
                classes.push('has-readings');
            }
        }

        if (inIframe()) {
            classes.push('lti-style')
        } else {
            classes.push('libraries-style');
        }

        const readingsBox = this.state.loading ? loadingPage() : this.readingsDisplay();

        function renderHeader() {
            return (<LibrariesHeader course={course}/>);
        }

        return (
            <div className={classes.join(' ')}>
                <Route path={`${process.env.PUBLIC_URL}/course`} render={renderHeader}/>

                <div className={'app-container'}>
                    <div className="readings">
                        <div className={"readings-header"}>
                            <h2>Readings</h2>
                        </div>
                        {readingsBox}
                    </div>
                    <div className="library-info">
                        <ul>
                            <li><a href="https://library.bc.edu" target="_blank" className="link-to-libraries">The
                                Boston College Libraries</a></li>
                        </ul>
                    </div>
                    <div className="research-guides">
                        <ResearchGuidesBox course={course} loading={this.state.loading}/>
                    </div>
                    <div className="librarian">
                        <LibrarianBox course={course} loading={this.state.loading}/>
                    </div>
                </div>
            </div>
        )
    }

    private readingsDisplay() {
        return (this.state.course.hasReadings) ? (<ReadingList readings={this.state.course.lists[0].citations}/>) :
            (<div className="no-readings-box">
                <div className="no-readings-message">No reserve readings were found for this section.</div>
            </div>);
    }
}

function loadingPage(): any {
    return (
        <ul className="is-loading">
            {readingsLoading()}
            {readingsLoading()}
            {readingsLoading()}
            {readingsLoading()}
            {readingsLoading()}
        </ul>
    );
}

function readingsLoading(): any {
    return (
        <li className="physical-book ph-item">
            <div className="thumbnail"/>
            <div className="book-ph-line"/>
            <div className="book-ph-line"/>
            <div className="book-ph-line"/>
        </li>
    );
}

function parseQueryString(): any {
    const queryPairs = location.search.substring(1).split('&');
    const queryObject = {};
    queryPairs.forEach(val => {
        const parts = val.split('=');
        queryObject[parts[0]] = parts[1];
    });
    return queryObject;
}


export default CourseDisplay;