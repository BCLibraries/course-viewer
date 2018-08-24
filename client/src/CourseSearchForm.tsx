import * as React from "react";
import {Redirect} from "react-router-dom";
import './CourseSearchForm.css';

class CourseSearchForm extends React.Component<{}, { query: string, submitted: boolean }> {

    public constructor(props: any) {
        super(props);
        this.state = {query: '', submitted: false};

        this.handleSearchBoxUpdate = this.handleSearchBoxUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        if (this.state.submitted) {
            let url = `${process.env.PUBLIC_URL}/${this.state.query}/section/_`;

            const found = this.state.query.match(/([a-zA-Z]+\d+)\.(\d\d?)/);
            if (found && found[1]) {
                url = `${process.env.PUBLIC_URL}/${found[1]}/section/${found[2]}`;
            }

            return <Redirect push={true} to={{pathname: url,}}/>;
        } else {
            return <div>
                <form className="search-form" onSubmit={this.handleSubmit}>
                    <label htmlFor="course-code-input">Lookup course by id and section</label>
                    <input type="text" id="course-code-input" onChange={this.handleSearchBoxUpdate}/>
                    <input type="submit" value="Submit"/>
                    <div className="example-below">example <span className="query-example">THEO1088.01</span></div>
                </form>
            </div>;
        }
    }

    private handleSearchBoxUpdate(event: any) {
        const value = event.target.value;
        this.setState({query: value});
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        this.setState({submitted: true});
        event.preventDefault();
    }
}

export default CourseSearchForm;