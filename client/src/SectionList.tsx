import * as React from 'react';
import {Link} from "react-router-dom";
import './SectionList.css';

const currentYear = 2019;
const currentSemester = 'F';


function sectionFactory(section: any) {
    const sectionDisplay = `${section.subjectCode}${section.courseNum}.${section.sectionNum}`;
    const url = `/course/${section.subjectCode}${section.courseNum}/section/${section.sectionNum}`;
    return (<li key={sectionDisplay}>
        <Link to={url}>{sectionDisplay}</Link>
    </li>);
}

function currentSectionFilter(section: any) {
    return (section.year === currentYear && section.semester === currentSemester);
}

class SectionList extends React.Component<{ sections: any }, {}> {
    public render() {
        const sectionList = this.props.sections.filter(currentSectionFilter).map(sectionFactory);
        return (
            <div className={"schedule"} >
                <h3>Fall 2019 courses</h3>
                <ul>{sectionList}</ul>
            </div>
        );
    }
}

export default SectionList;