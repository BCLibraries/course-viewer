import * as React from 'react';
import Course from "./Course";
import './LibrarianBox.css';

class LibrarianBox extends React.Component<{ course: Course, loading: boolean }, {}> {
    public render() {
        if (this.props.loading) {
            return (
                <div>
                    <div className="ph-librarian-header"/>
                    <div className="ph-librarian ph-item">
                        <div className="ph-librarian-image"/>
                        <div className="ph-librarian-info"/>
                        <div className="ph-librarian-info"/>
                    </div>
                </div>
            );
        }


        const course = this.props.course;

        if (!course.subjectInfo || !course.subjectInfo.experts) {
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