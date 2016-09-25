'use strict';
import React from 'react';

export default class BaseComponent extends React.Component {
    bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }
}