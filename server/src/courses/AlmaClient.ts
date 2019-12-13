import buildThrottledClient from './ThrottledWebClient'

// The HTTP client we use is Axios wrapped in some throttling logic
// to prevent overstepping the API concurrent request threshold.
const webClient = buildThrottledClient();

async function fetchFromAlma(url: string, localParams: any) {
    const baseParams = {
        apikey: process.env.ALMA_APIKEY,
        format: "json",
        view: "full"
    };

    const params = {...baseParams, ...localParams};
    return webClient.get(process.env.ALMA_API_BASE + url, {params});
}

export default fetchFromAlma;