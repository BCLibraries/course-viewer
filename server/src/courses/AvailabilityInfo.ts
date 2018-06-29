class AvailabilityInfo {
    public library: string;
    public location: string;
    public callNumber: string;
    public availability: string;
    public locationName: string;
    public updateTime: number = Date.now();
}

export default AvailabilityInfo;