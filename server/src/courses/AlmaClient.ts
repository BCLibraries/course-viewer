import buildThrottledClient from './ThrottledWebClient'

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