import axios from 'axios';
import Guide from "./Guide";

/**
 * Fetch LibGuides related to a course
 *
 * @param code
 * @param section
 */
async function fetchGuides(code: string, section: string) {
    const response = await fetchFromLibGuides(code, section);
    return response.data.map(buildGuide);
}

/**
 * Generate array of possible tags for a course
 *
 * Guides can be tagged in several ways to appear in a course. For example, if the course is ENGL1234,
 * appropriate guides might be tagged:
 *
 *     * ENGL
 *     * ENGL1234
 *     * ENGL1234-01
 *     * ENGL1234.01
 *     * ENGL1xxx
 *     * ENGL12xx
 *     * ENGL123x
 *
 * @param code
 * @param section
 */
function getTagNames(code: string, section: string) {
    return [
        code.substring(0, 4),
        code,
        `${code}-${section}`,
        `${code}.${section}`,
        code.substring(0, 5) + 'xxx',
        code.substring(0, 6) + 'xx',
        code.substring(0, 7) + 'x'
    ];
}

/**
 * Send a query to LibGuides for a course
 *
 * @param code
 * @param section
 */
function fetchFromLibGuides(code: string, section: string) {

    // Temporary hack to fix cross-listed course with guides but no reserves.
    code = code.toUpperCase();

    // Tags to search for
    let tagNames:string[] = getTagNames(code, section);

    // Special case for this non-really-crosslisted course.
    if (code === 'HIST1511' || code === 'BIOL1503') {
        tagNames = getTagNames('HIST1511', '01').concat(getTagNames('BIOL1503', '01'));
    }

    const siteId = (code.includes('LAWS')) ? process.env.LAW_LIBGUIDES_SITE_ID : process.env.LIBGUIDES_SITE_ID;

    // See https://bc.libapps.com/libguides/api.php?action=1&resource=1&version=1.1 for documentation for
    // LibGuides API.
    const queryParams = {
        site_id: siteId,
        key: process.env.LIBGUIDES_KEY,
        expand: 'tags',
        status: '1,2',
        tag_names: tagNames.join(',')
    };
    return axios.get('https://lgapi-us.libapps.com/1.1/guides', {params: queryParams});
}

/**
 * Convert LibGuides API response to a Guide object
 *
 * @param guideJson
 */
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