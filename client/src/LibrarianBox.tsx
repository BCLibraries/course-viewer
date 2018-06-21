import * as React from 'react';
import Course from "./Course";
import './LibrarianBox.css';

class LibrarianBox extends React.Component<{ course: Course }, {}> {
    public render() {
        const course = this.props.course;

        if (!course.subjectInfo.experts) {
            return (<span/>);
        }

        const experts = course.subjectInfo.experts;
        const libTerm = (experts.length > 1) ? 'librarians' : 'librarian';

        return (
            <div>
                <h4>Your {libTerm}</h4>
                {experts.map((expert: any, index: any) => {
                        return (
                            <div key={index} className="librarian-box">
                                <figure>
                                    <img src={expert.imageUrl} alt='photo of subject librarian'/>
                                    <figcaption>
                                        <div className="name">
                                            <a href={expert.url} target="_blank">{expert.firstName} {expert.lastName}</a>
                                        </div>
                                        <div className="title">Subject Librarian for {course.subjectInfo.name}</div>
                                    </figcaption>
                                </figure>
                            </div>
                        )
                    }
                )};
            </div>
        );
    }
}

export default LibrarianBox;