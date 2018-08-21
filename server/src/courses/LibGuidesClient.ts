import axios from 'axios';
import Course from "./Course";
import Guide from "./Guide";

async function fetchGuides(course: Course) {
    const dept = course.code.substring(0, 4);
    const fullCourse = `${dept}${course.number}`;
    const withSection = `${fullCourse}-${course.section}`;
    const response = await fetchFromLibGuides(dept, fullCourse, withSection);
    course.research_guides = response.data.map(buildGuide);
    return course;
}

function fetchFromLibGuides(dept: string, fullCourse: string, withSection: string) {
    const tagNames = [
        dept,
        fullCourse,
        withSection,
        withSection.replace('-', '.'),
        fullCourse.substring(0, 5) + 'xxx',
        fullCourse.substring(0, 6) + 'xx',
        fullCourse.substring(0, 7) + 'x'
    ];
    const params = {
        site_id: process.env.LIBGUIDS_SITE_ID,
        key: process.env.LIBGUIDES_KEY,
        expand: 'tags',
        status: '1,2',
        tag_names: tagNames.join(',')
    };
    return axios.get('https://lgapi-us.libapps.com/1.1/guides', {params});
}

function buildGuide(guideJson: any) {
    const guide = new Guide;
    guide.title = guideJson.name;
    guide.friendlyUrl = guideJson.friendly_url;
    guide.url = guideJson.url;
    guide.tags = guideJson.tags.map((tag: any) => {
        return tag.text
    });
    return guide;
}

export default fetchGuides;