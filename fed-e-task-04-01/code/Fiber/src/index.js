import React, { render, Component } from "./react";

const root = document.getElementById("root");
const jsx = (
  <div>
    <p>HEllo React</p>
    <p>ggggg</p>
  </div>
);
render(jsx, root);

setTimeout(() => {
  const jsx = (
    <div>
      <p>奥利给</p>
      <p>ggggg</p>
    </div>
  );
  render(jsx, root);
}, 2000);

class Greating extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        hahahhahahah
        <p>{this.props.title}</p>
      </div>
    );
  }
}

function FnComponent(props) {
  return <div>{props.title} FnComponent</div>;
}

// render(<Greating title="hello" />, root);
// render(<FnComponent title="hello" />, root);
