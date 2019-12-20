// react
import React from 'react';
import ReactDOM from 'react-dom';
// typescript
interface IProps {
    num: number
}
let initState = {count: 0};
type State = Readonly<typeof initState>;
class Counter extends React.Component<IProps>{
    state: State = initState;
    handerClick = () => {
        this.setState({ count: this.state.count + 1})
    }
    render(){
        return <div>
            { this.state.count }
            <button onClick={this.handerClick}>点击我</button>
        </div>
    }
}
ReactDOM.render(<Counter num={1}></Counter>, document.getElementById('ts-react-root'));

// 使用TS有2种方案
// ts-loader 