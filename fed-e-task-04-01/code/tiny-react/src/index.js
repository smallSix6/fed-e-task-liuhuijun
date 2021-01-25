import TinyReact from "./TinyReact";

const root = document.getElementById("root");

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2>(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert("你好")}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
  </div>
);

const modifyDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="test123">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察: 这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段被修改过的内容</span>
    <button onClick={() => alert("你好!!!!!")}>点击我</button>
    <input type="text" value="13" />
  </div>
);

function Demo() {
  return <div>hello</div>;
}

function Heart(props) {
  return (
    <div className={props.title}>
      {props.title}
      &hearts; <Demo />
    </div>
  );
}

class Alert extends TinyReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "default Title",
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ title: "change Title" });
  }
  componentDidMount() {
    console.log("componentDidMount");
  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps:", nextProps);
  }
  componentWillUpdate(nextProps, nextState) {
    console.log("componentWillUpdate:", nextProps);
  }
  componentDidUpdate(prevProps, preState) {
    console.log("componentDidUpdate");
  }
  render() {
    console.log("state", this.state);
    return (
      <div>
        {this.props.name}
        {this.props.age}
        <div>
          {this.state.title}
          <button onClick={this.handleClick}>改变Title</button>
        </div>
      </div>
    );
  }
}
// TinyReact.render(<Alert name="张三" age={20} />, root);

// TinyReact.render(virtualDOM, root)

// setTimeout(() => {
//   TinyReact.render(modifyDOM, root)
// }, 2000)

// setTimeout(() => {
//   // TinyReact.render(<Heart name="李四" age={50} />, root);
//   TinyReact.render(<Alert name="李四" age={50} />, root);
// }, 2000);

class DemoRef extends TinyReact.Component {
  handle() {
    let value = this.input.value;
    console.log(value);
    console.log(this.alert);
  }
  render() {
    return (
      <div>
        <input type="text" ref={(input) => (this.input = input)} />
        <button onClick={this.handle.bind(this)}>按钮</button>
        <Alert ref={(alert) => (this.alert = alert)} name="李四" age={50} />
      </div>
    );
  }
}

TinyReact.render(<DemoRef />, root);
