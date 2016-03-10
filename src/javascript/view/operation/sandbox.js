"use strict";
var React = require('react');

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

        return (
            <div className="sandbox">
                <input type="button" value="Try it out!" onClick={this.send}/>
                {partial}
            </div>
        );
    }
});