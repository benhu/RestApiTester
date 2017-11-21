'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import BaseComponent from './base';
import HeaderOperation from './operation/header';
import ContentOperation from './operation/content';

export default class Operation extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {displayContent: props.displayContent};
        this.bind('onHeaderClick');
    }

    onHeaderClick() {
        this.setState({displayContent: !this.state.displayContent});
    }

    render() {
        return(
            <li className={this.props.data.method + " operations" + (this.state.displayContent ? " active" : "")}>
                <HeaderOperation httpMethod={this.props.data.method} path={this.props.data.path} description={this.props.data.description} onClick={this.onHeaderClick}/>
                <ContentOperation display={this.state.displayContent} data={this.props.data} server={this.props.server} canBeLocalhost={this.props.canBeLocalhost}/>
            </li>
        );
    }
}

Operation.propTypes = { displayContent: PropTypes.bool };
Operation.defaultProps = { displayContent: false };