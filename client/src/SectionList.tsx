import * as React from 'react';
import {Link} from "react-router-dom";
import './SectionList.css';

const currentYear = 2019;
const currentSemester = 'F';


function sectionFactory(section: any) {
    const sectionDisplay = `${section.subjectCode}${section.courseNum}.${section.sectionNum}`;
    const url = `${process.env.PUBLIC_URL}/${section.subjectCode}${section.courseNum}/section/${section.sectionNum}`;
    return (<li key={sectionDisplay}>
        <Link to={url}>{sectionDisplay}</Link>
    </li>);
}

function currentSectionFilter(section: any) {
    return (section.year === currentYear && section.semester === currentSemester);
}

class SectionList extends React.Component<{ sections: any }, {}> {
    public render() {
        const currentSections = this.props.sections.filter(currentSectionFilter);
        let mainContent = <div className="no-courses-box">
            <div className="no-courses-message">
                We could not find any Fall 2018 courses that you are registered for. If you believe you have received
                this
                message in error, please <a href="https://library.bc.edu/feedback/">contact Boston College Libraries
                support</a>.
            </div>
        </div>;

        if (currentSections.length !== 0) {
            const sectionListItems = currentSections.map(sectionFactory);
            mainContent = <ul>{sectionListItems}</ul>;
        }
        return (
            <div className={"schedule"}>
                <h3>Fall 2018 courses</h3>
                {mainContent}
            </div>
        );
    }
}

export default SectionList;