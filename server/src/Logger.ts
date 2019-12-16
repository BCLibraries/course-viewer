import bunyan from "bunyan";
import path from "path";

/**
 * Log to rotating text files
 */
const logger = bunyan.createLogger({
    name: 'main-logger',
    streams: [{
        type: 'rotating-file',
        level: 'info',
        path: path.join(__dirname, '..', 'log/reserves.log'),
        period: '1d',   // daily rotation
        count: 180        // keep 3 back copies
    }]
});

export default logger;