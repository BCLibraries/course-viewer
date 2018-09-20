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

        let subjectInfoLink = <span />
        if (!course.researchGuides && (!course.subjectInfo || !course.subjectInfo.slug)) {
            const url = `https://libguides.bc.edu/${course.subjectInfo.slug}`;
            subjectInfoLink = <li><a href={url} target="_blank">{course.subjectInfo.name} resources</a></li>;
        }

        const guides = course.researchGuides.map(guideFactory);

        return (
            <div className="research-guides-block">
                <h4>Research guides</h4>
                <ul>
                    {guides}
                    {subjectInfoLink}
                </ul>
            </div>
        );
    }
}

function guideFactory(guide: any) {
    const guideUrl = guide.friendlyUrl ? guide.friendlyUrl : guide.url;
    return (<li key={guide.friendlyUrl}><a href={guideUrl} target="_blank">{guide.title}</a></li>);
}

export default ResearchGuidesBox;