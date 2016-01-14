var React = require('react');
var ReactDOM = require('react-dom');
require('bootstrap');

var cx = require('classnames');

var Tree = require('react-ui-tree');

//var Tree = require('../lib/react-ui-tree.js');
var tree = require('./tree');

//require('../lib/react-ui-tree.less');
//require('./theme.less');
//require('./app.less');


var App = React.createClass({
  getInitialState() {
    return {
      active: null,
      tree: tree
    };
  },

  renderNode(node) {
    return (
      <span className={cx('node', {
        'is-active': node === this.state.active
        })} onClick={this.onClickNode.bind(null, node)}>
        {node.module}
      </span>
    );
  },

  onClickNode(node) {
    this.setState({
      active: node
    });
  },

  render() {
    return (
      <div className="app">
        <div className="tree">
          <Tree
            paddingLeft={20}
            tree={this.state.tree}
            onChange={this.handleChange}
            isNodeCollapsed={this.isNodeCollapsed}
            renderNode={this.renderNode}
          />
        </div>
      </div>
    );
  },

  handleChange(tree) {
    this.setState({
      tree: tree
    });
  },

  updateTree() {
    var tree = this.state.tree;
    tree.children.push({module: 'test'});
    this.setState({
      tree: tree
    });
  }
});





var Root = React.createClass({
  render: function() {
    return (<div><div>hello</div><App /></div>);
  }
});

var data = {
  text: "Node 1"
}

ReactDOM.render(React.createElement(Root), document.getElementById('main'));