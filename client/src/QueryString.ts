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

    public hasValue(key: string): boolean {
        return this.queryPairs.has(key);
    }

    public getValue(key: string): string {
        if (!this.queryPairs.has(key)) {
            return '';
        }
        const value = this.queryPairs.get(key);
        return (value === null) ? value : '';
    }
}

export default QueryString;