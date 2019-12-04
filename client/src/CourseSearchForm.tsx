import * as React from "react";
import {useState} from "react";
import {Redirect} from "react-router-dom";
import './CourseSearchForm.css';

/**
 * The search form for finding a course
 *
 * Course searches are performed by entering either a formatted course section (e.g. "THEO1033.01") or
 * (rarely) by a full Alma searchable course ID. The form redirects to the course display page.
 *
 * @constructor
 */
function CourseSearchForm() {
    let [query, setQuery] = useState('');
    let [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return redirectToSearch(query);
    }

    return (
        <div>
            <form className="search-form" onSubmit={handleSubmit}>
                <label htmlFor="course-code-input">Lookup course by id and section</label>
                <input type="text" id="course-code-input" onChange={handleSearchBoxUpdate}/>
                <input type="submit" value="Submit"/>
                <div className="example-below">example <span className="query-example">THEO1088.01</span></div>
            </form>
        </div>
    );

    function handleSearchBoxUpdate(event: any) {
        setQuery(event.target.value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        setSubmitted(true);
        event.preventDefault();
    }

}

function redirectToSearch(query: string) {

    // By default use the full query text as course ID and use a blank target.
    let url = `${process.env.PUBLIC_URL}/${query}/section/_`;

    // If a properly-formatted request is submitted (e.g. THEO1033.01), break
    // it into course and section components.
    const found = query.match(/([a-zA-Z]+\d+)\.(\d\d?)/);
    if (found && found[1]) {
        url = `${process.env.PUBLIC_URL}/${found[1]}/section/${found[2]}`;
    }

    return <Redirect push={true} to={{pathname: url,}}/>;
}

export default CourseSearchForm;