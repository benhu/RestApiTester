'use strict';
import React from 'react';
import Uuid from 'uuid/v4';
import ObjectHelper from '../../helper/object';
import Editor from './editor';

export default class Parameter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: Uuid(),
            value: '',
            requiredAttr: {}
        };
        this.bind('onInputChange', 'onEditorChange')
    }

    bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    componentWillMount() {
        if(this.props.default && typeof this.props.default === 'object'){
            this.setState({
                value: JSON.stringify(this.props.default, undefined, 4)
            });
        }else{
            this.setState({
                value: this.props.default
            });
        }

        if(this.props.required) {
            this.setState({
                requiredAttr: {required: 'required', placeholder:'(required)'}
            });
        }
    }

    onInputChange(e){
        if(this.props.onChange){
            this.props.onChange(this.props.name, e.target.value);
        }
        this.setState({
            value: e.target.value
        });
    }

    onEditorChange(value){
        this.props.onChange(this.props.name, value);
    }

    render(){
        let input;
        const objHelper = new ObjectHelper();
        const emptyClass = this.props.required && objHelper.isEmpty(this.state.value) ? 'empty' : '';
        if(this.props.name === 'body') {
            input = <Editor id={this.state.id} code={this.state.value} onChange={this.onEditorChange} className={emptyClass} {...this.state.requiredAttr}/>;
        }else if(this.props.type === 'boolean'){
            input = <input id={this.state.id} type="checkbox" value={this.state.value} onChange={this.onInputChange} className={emptyClass} {...this.state.requiredAttr}/>;
        }else{
            input = <input id={this.state.id} type="text" value={this.state.value} onChange={this.onInputChange} className={emptyClass} {...this.state.requiredAttr}/>;
        }

        let label;

        if(this.props.label) {
            label = <label htmlFor={this.state.id}>{this.props.label}<span className='param_key'>{this.props.name}</span></label>;
        } else {
            label = <label htmlFor={this.state.id}>{this.props.name}</label>;
        }


        return (
            <tr>
                <td>
                    {label}
                </td>
                <td>
                    {input}
                </td>
            </tr>
        );
    }
}