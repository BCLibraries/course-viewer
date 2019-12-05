import * as React from 'react';

class LinkToReading extends React.Component<{ mms: string, title: any }, {}> {
    public render() {
        const url = `${process.env.REACT_APP_API_BASE}/items/${this.props.mms}`;
        return (<a href={url} target={'_blank'}>{this.props.title}</a>);
    }
}

export default LinkToReading;