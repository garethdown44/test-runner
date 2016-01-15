'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Treebeard, decorators} from '../src/index';

import data from './data';
import styles from './styles';

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = (props) => {
    const style = props.style;
    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = { marginRight: '5px' };
    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                {props.node.name}
            </div>
        </div>
    );
};

class NodeViewer extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const style = styles.viewer;
        let json = JSON.stringify(this.props.node, null, 4);
        if(!json){ json = HELP_MSG; }
        return (
            <div style={style.base}>
                {json}
            </div>
        );
    }
}

NodeViewer.propTypes = {
    node: React.PropTypes.object
};

//@Radium
class DemoTree extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
    }
    render(){
        return (
            <div>
                <div style={styles.component}>
                    <Treebeard
                        data={data}
                        onToggle={this.onToggle}
                        decorators={decorators}
                    />
                </div>
                <div style={styles.component}>
                    <NodeViewer node={this.state.cursor}/>
                </div>
            </div>

        );
    }
}

module.exports = Radium(DemoTree);