import axios from 'axios';
import Guide from "./Guide";

async function fetchGuides(code: string, section: string) {
    const response = await fetchFromLibGuides(code, section);
    return response.data.map(buildGuide);
}

function fetchFromLibGuides(code: string, section: string) {
    const tagNames = [
        code.substring(0, 4),
        code,
        `${code}-${section}`,
        `${code}.${section}`,
        code.substring(0, 5) + 'xxx',
        code.substring(0, 6) + 'xx',
        code.substring(0, 7) + 'x'
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