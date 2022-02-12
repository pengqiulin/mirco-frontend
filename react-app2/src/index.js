import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import App from './App';
import actions from './shared/actions'
import SharedModule from './shared/index'
import './public-path';
import './index.css';

function render(props={}) {
  const { container,shared = SharedModule.getShared() } = props;
  SharedModule.overloadShared(shared);
  ReactDOM.render(
    <React.StrictMode>
      <Router basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>
        <App />
      </Router>
    </React.StrictMode>,
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[react17] react app bootstraped');
}

export async function mount(props) {
  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
  }

  // props.onGlobalStateChange((state, prev) => {
  //   // state: 变更后的状态; prev 变更前的状态
  //   console.log('子应用接收的数据count',state.count);
  // });
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
