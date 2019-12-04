/**
 * Represents a HTTP query string
 *
 * Parses a query string (e.g. "?course_sis_id=THEO1000&source=lti") into component key/value pairs and makes them
 * queryable.
 *
 */
class QueryString {
    private queryPairs: Map<string, string>;

    constructor(queryString?: string) {
        if (!queryString) {
            queryString = window.location.search.substring(1);
        }
        this.queryPairs = new Map<string, string>();
        queryString.split('&').forEach(val => {
            const parts = val.split('=');
            this.queryPairs.set(parts[0], parts[1]);
        });
    }

    /**
     * Does a value exist in a query string?
     *
     * Returns true if the query string contains a value for the given key, false otherwise.
     *
     * @param key
     */
    public hasValue(key: string): boolean {
        return this.queryPairs.has(key);
    }

    /**
     * Get a query string value
     *
     * Returns the value for the given key. Returns an empty string if no value is found.
     *
     * @param key
     */
    public getValue(key: string): string {
        if (!this.queryPairs.has(key)) {
            return '';
        }
        const value = this.queryPairs.get(key);
        return (value === null) ? value : '';
    }
}

export default QueryString;