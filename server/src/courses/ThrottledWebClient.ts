import axios, {AxiosInstance} from 'axios';

/**
 * Return a throttled Web client
 */
function buildThrottledClient() {
    const webClient = axios.create({timeout: 20000});
    scheduleRequests(webClient, 200);
    return webClient;
}

/**
 * Throttle Alma requests to keep in line with API limits
 *
 * Alma only allows only allows 25 API calls/second per institution. Because there are other
 * services using the Alma API, we limit the reserves service to one call every 200ms, or 5
 * calls per second.
 *
 * Courtesy galenus@StackOverflow
 * https://stackoverflow.com/questions/43482639/throttling-axios-requests
 */
function scheduleRequests(axiosInstance:AxiosInstance, intervalMs: number) {
    let lastInvocationTime:number = 0;

    const scheduler = (config:any) => {
        const now = Date.now();
        if (lastInvocationTime) {
            lastInvocationTime += intervalMs;
            const waitPeriodForThisRequest = lastInvocationTime - now;
            if (waitPeriodForThisRequest > 0) {
                return new Promise((resolve) => {
                    setTimeout(
                        () => resolve(config),
                        waitPeriodForThisRequest);
                });
            }
        }

        lastInvocationTime = now;
        return config;
    };

    axiosInstance.interceptors.request.use(scheduler);
}

export default buildThrottledClient;