import * as React from 'react';
import Course from './Course';

class LibrariesHeader extends React.Component<{ course: Course }, {}> {
    public render() {

        if (!this.props.course.number) {
            return (<h2 className="course-name placeholder"/>);
        }
        return (
            <h2 className="course-name">
                <span className="course-id">{this.props.course.subject}{this.props.course.number}-{this.props.course.section} </span>
                {this.props.course.name}
            </h2>
        );
    }
}

export default LibrariesHeader;