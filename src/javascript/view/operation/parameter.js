"use strict";
var React = require('react');
var Uuid = require('node-uuid');
var UrlHelper = require('../../helper/rat.js');
var Editor = require('./editor.js');

module.exports = React.createClass({
    getInitialState() {
        return {
            id: Uuid.v4(),
            value: '',
            requiredAttr: {}
        };
    },
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
    },
    onInputChange(e){
        if(this.props.onChange){
            this.props.onChange(this.props.name, e.target.value);
        }
        this.setState({
            value: e.target.value
        });
    },
    onEditorChange(value){
        this.props.onChange(this.props.name, value);
    },
    render(){
        let input;

        const emptyClass = this.props.required && UrlHelper.isEmpty(this.state.value) ? 'empty' : '';

        if(this.props.name === 'body') {
            input = <Editor id={this.state.id} code={this.state.value} onChange={this.onEditorChange} className={emptyClass} {...this.state.requiredAttr}/>;
        }else{
            input = <input id={this.state.id} type="text" value={this.state.value} onChange={this.onInputChange} className={emptyClass} {...this.state.requiredAttr}/>;
        }

        const label = this.props.label ? this.props.label : this.props.name;

        return (
            <tr>
                <td>
                    <label htmlFor={this.state.id}>{label}</label>
                </td>
                <td>
                    {input}
                </td>
            </tr>
        );
    }
});