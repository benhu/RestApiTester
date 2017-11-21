'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Ace from 'brace';
import Json from 'brace/mode/json';
import Chrome from 'brace/theme/chrome';

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.bind('onChange');
    }

    bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.refs.editor);
        const editor = Ace.edit(node);
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/json");
        editor.setShowPrintMargin(false);
        editor.setOptions({minLines: 5});
        editor.setOptions({maxLines: 50});
        editor.getSession().on("change", () => {this.props.onChange(editor.getSession().getValue())});
    }

    onChange() {
        if (this.props.onChange && !this.silent) {
            const value = this.editor.getValue();
            this.props.onChange(value);
        }
    }

    render() {
        const style = {fontSize: '14px !important', border: '1px solid lightgray'};
        return (
            <div ref="editor" style={style}>
                {this.props.code}
            </div>
        );
    }
}

Editor.propTypes = { mode: PropTypes.string, content: PropTypes.string };