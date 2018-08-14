import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Fetch polyfill
import "promise/polyfill";
import "whatwg-fetch";


/* IE Shims */
// String.includes()
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);