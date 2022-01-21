import buildThrottledClient from './ThrottledWebClient'

// The HTTP client we use is Axios wrapped in some throttling logic
// to prevent overstepping the API concurrent request threshold.
const webClient = buildThrottledClient();

async function fetchAvailability(mmsIds: any) {
    // Filter out undefined MMSes prevent a bad query.
    mmsIds = mmsIds.filter((mmsId: any) => mmsId != undefined);
    const query = mmsIds.join('+');
    return webClient.get(`${process.env.AVAILABILITY_BASE}/bib/${query}`,{});
}

export default fetchAvailability;