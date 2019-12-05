import * as React from "react";
import {Route} from "react-router";
import './Placeholder.css';


type CourseDisplayProps = {
    classes: string[],    // The classes to apply to the course display element
    renderHeader: any,          // Function to render the page header
    readingList: any,     // The reading list
    researchGuides: any,  // The research guides associated with the class
    linkToLibrary: any,   // Text with a link to the appropriate library
    librarians: any       // Librarians for the course
}

/**
 * Display a course
 * 
 * @param classes
 * @param renderHeader
 * @param readingList
 * @param researchGuides
 * @param linkToLibrary
 * @param librarians
 * @constructor
 */
function CourseDisplay({classes, renderHeader, readingList, researchGuides, linkToLibrary, librarians}: CourseDisplayProps) {
    return (
        <div className={classes.join(' ')}>
            <Route path={`${process.env.PUBLIC_URL}/:course_id/section/:section_id`} render={renderHeader}/>

            <div className={'app-container'}>
                <div className="readings">
                    <div className={"readings-header"}>
                        <h2>Readings</h2>
                    </div>
                    {readingList}
                </div>
                {linkToLibrary}
                <div className="research-guides">
                    {researchGuides}
                </div>
                <div className="librarian">
                    {librarians}
                    <a onClick={openChat} className={"chat-link btn btn-primary"}>Chat with us <i className={"fa fa-commenting-o"}/></a>
                </div>
            </div>
        </div>
    );
}

/**
 * Open an AJCU chat service window
 */
function openChat() {
    window.open('https://library.bc.edu/chat', 'chat', 'resizable=1,width=320,height=300')
}


export default CourseDisplay;