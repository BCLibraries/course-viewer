import * as React from 'react';
import Course from "./Course";
import './ResearchGuidesBox.css';
import ResearchGuidesPlaceholder from "./ResearchGuidesPlaceholder";

/**
 * Display relevant research guides
 *
 * @param loading
 * @param course
 * @constructor
 */
function ResearchGuidesBox({loading, course}: { course: Course, loading: boolean }) {

    // Show placeholder if we're still loading, otherwise...
    if (loading) {
        return <ResearchGuidesPlaceholder/>
    }

    // Show the research guides.
    return (
        <div className="research-guides-block">
            <h4>Research guides</h4>
            <ul>
                {course.researchGuides.map(guideFactory)}
                {subjectInfoLink(course)}
            </ul>
        </div>
    );
}

/**
 * Build a research guide list item
 *
 * @param guide
 */
function guideFactory(guide: any) {
    const guideUrl = guide.friendlyUrl ? guide.friendlyUrl : guide.url;
    return <li key={guide.friendlyUrl}><a href={guideUrl} target="_blank" rel="noopener noreferrer">{guide.title}</a></li>;
}

/**
 * Link to the general subject guide if no relevant guides are found
 *
 * @param course
 */
function subjectInfoLink(course: Course) {
    if (!course.researchGuides && (!course.subjectInfo || !course.subjectInfo.slug)) {
        const url = `https://libguides.bc.edu/${course.subjectInfo.slug}`;
        return <li><a href={url} target="_blank" rel="noopener noreferrer">{course.subjectInfo.name} resources</a></li>;
    }
    return <span/>;
}

export default ResearchGuidesBox;