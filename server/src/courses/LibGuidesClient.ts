import axios from 'axios';
import Course from "./Course";
import Guide from "./Guide";

async function fetchGuides(course: Course) {
    const dept = course.department.toUpperCase();
    const fullCourse = `${dept}${course.code}`;
    const withSection = `${fullCourse}-${course.section}`;
    const response = await fetchFromLibGuides(dept, fullCourse, withSection);
    course.research_guides = response.data.map(buildGuide);
    return course;
}

function fetchFromLibGuides(dept: string, fullCourse: string, withSection: string) {
    const params = {
        site_id: process.env.LIBGUIDS_SITE_ID,
        key: process.env.LIBGUIDES_KEY,
        expand: 'tags',
        status: '1',
        tag_names: [dept, fullCourse, withSection].join(',')
    };
    return axios.get('https://lgapi-us.libapps.com//1.1/guides', {params});
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