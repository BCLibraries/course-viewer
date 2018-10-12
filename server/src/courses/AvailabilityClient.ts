import buildThrottledClient from './ThrottledWebClient'

const webClient = buildThrottledClient();

async function fetchAvailability(mmsIds: any) {
    const query = mmsIds.join('+');
    return webClient.get(`${process.env.AVAILABILITY_BASE}/bib/${query}`,{});
}

export default fetchAvailability;