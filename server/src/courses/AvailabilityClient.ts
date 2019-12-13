import buildThrottledClient from './ThrottledWebClient'

// The HTTP client we use is Axios wrapped in some throttling logic
// to prevent overstepping the API concurrent request threshold.
const webClient = buildThrottledClient();

async function fetchAvailability(mmsIds: any) {
    const query = mmsIds.join('+');
    return webClient.get(`${process.env.AVAILABILITY_BASE}/bib/${query}`,{});
}

export default fetchAvailability;