'use strict';
import React from 'react';

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hidden: false};
        this.bind('show', 'hide', 'onClick');
    }

    bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    componentWillMount() {
        if (this.props.wait && !this.props.hide) {
            this.hide();
            setTimeout(() => {
                this.show();
            }, this.props.wait);
        }
    }

    show() {
        this.setState({
            hidden: false
        });
    }

    hide() {
        this.setState({
            hidden: true
        });
    }

    onClick(e) {
        e.preventDefault();

        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        let className = '';

        if (this.props.class) {
            className = this.props.class;
        }

        if (this.state.hidden || this.props.hide) {
            className += className != '' ? ' ' : '';
            className += 'hidden';
        }

        return (
            <button onClick={this.onClick} className={className}>
                {this.props.children}
            </button>
        );
    }
}