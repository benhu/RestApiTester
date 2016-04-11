"use strict";
const React = require('react');

module.exports = React.createClass({
    send(e) {
        e.preventDefault();

        if(this.props.onSubmit){
            this.props.onSubmit();
        }
    },
    clear(e) {
        e.preventDefault();

        if(this.props.onClear){
            this.props.onClear();
        }
    },
    render() {
        let partial = null;

        if(this.props.hasResponse){
            partial = <input type="button" value="Clear response" onClick={this.clear}/>;
        }

        const spinnerClass = this.props.loading ? "spinner" : "hidden";

        return (
            <div className="sandbox">
                <input type="button" value="Try it out!" onClick={this.send}/>
                {partial}
                <div className={spinnerClass}><div className="circle"></div></div>
            </div>
        );
    }
});