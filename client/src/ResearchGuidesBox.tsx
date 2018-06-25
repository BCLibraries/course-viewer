import * as React from 'react';
import Course from "./Course";
import './ResearchGuidesBox.css';

class ResearchGuidesBox extends React.Component<{ course: Course, loading: boolean }, {}> {
    public render() {
        if (this.props.loading) {
            return (
                <div className="research-guides-block">
                    <div className="ph-research-guides-header"/>
                    <div className="ph-research-guides-header"/>
                    <div className="ph-research-guides-header"/>
                    <div className="ph-research-guides-header"/>
                </div>
            );
        }

        const course = this.props.course;

        if (!course.subjectInfo.slug) {
            return (<span/>);
        }

        const url = `https://libguides.bc.edu/${course.subjectInfo.slug}`;

        return (
            <div className="research-guides-block">
                <h4>Research guides</h4>
                <a href={url} target="_blank">{course.subjectInfo.name} resources</a>
            </div>
        );
    }
}

export default ResearchGuidesBox;