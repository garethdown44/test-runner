var React = require('react');
var ReactDOM = require('react-dom');
require('bootstrap');

var Tree = require('./Tree');


var Root = React.createClass({
  render: function() {
    return (<div><div>hello</div><Tree /></div>);
  }
});

var data = {
  text: "Node 1"
}

ReactDOM.render(React.createElement(Root), document.getElementById('main'));