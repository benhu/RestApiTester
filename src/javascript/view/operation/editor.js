"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var Ace = require('brace');
require('brace/mode/json');
require('brace/theme/chrome');

module.exports = React.createClass({
    propTypes: {
        mode: React.PropTypes.string,
        content: React.PropTypes.string,
    },
    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.refs.editor);
        const editor = Ace.edit(node);
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/json");
        editor.setShowPrintMargin(false);
        editor.setOptions({minLines: 5});
        editor.setOptions({maxLines: 50});
        editor.getSession().on("change", () => {this.props.onChange(editor.getSession().getValue())});
    },
    onChange() {
        if (this.props.onChange && !this.silent) {
            const value = this.editor.getValue();
            this.props.onChange(value);
        }
    },
    render() {
        const style = {fontSize: '14px !important', border: '1px solid lightgray'};
        return (
            <div ref="editor" style={style}>
                {this.props.code}
            </div>
        );
    }
});