"use strict";
const React = require('react'),
      Button = require('../button.jsx');

module.exports = React.createClass({
    send(e) {
        e.preventDefault();

        if(this.props.onSubmit){
            this.props.onSubmit();
        }
    },
    render() {
        const spinnerClass = this.props.loading ? "spinner" : "hidden";

        return (
            <div className="sandbox">
                <Button onClick={this.props.onSubmit}>Try it out! <div className={spinnerClass}><div className="circle"></div></div></Button>
                <Button onClick={this.props.onStop} hide={!this.props.loading} class="danger" wait="1000">Stop</Button>
                <Button onClick={this.props.onClear} hide={!this.props.hasResponse} class="warning">Clear response</Button>
            </div>
        );
    }
});