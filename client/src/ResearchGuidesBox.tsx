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

        const guides = course.researchGuides.map(guideFactory);

        return (
            <div className="research-guides-block">
                <h4>Research guides</h4>
                <ul>
                    {guides}
                    <li><a href={url} target="_blank">{course.subjectInfo.name} resources</a></li>
                </ul>
            </div>
        );
    }
}

function guideFactory(guide: any) {
    return (<a href={guide.friendlyUrl} key={guide.url} target="_blank">{guide.title}</a>);
}

export default ResearchGuidesBox;