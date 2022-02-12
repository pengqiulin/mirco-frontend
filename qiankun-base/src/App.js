import { useState } from "react";
import { Button, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import actions from "./shared/actions";
import shared from './shared/index'
import "./App.css";
const { Header, Content, Footer, Sider } = Layout;
actions.onGlobalStateChange((state, prevState) => {
  // state: 变更后的状态; prevState: 变更前的状态
  console.log("主应用观察者：count 改变前的值为 ", prevState.count);
  console.log("主应用观察者：改变后的值为 ", state.count);
});
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [count, updateCount] = useState(0)
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const buttonClick=()=>{
    updateCount(1)
    actions.setGlobalState({ count })
    shared.setCount(1)
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/app-vue">Vue应用</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            <Link to="/app-react">React应用</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          <div
            id="container"
            className="site-layout-background"
            style={{ minHeight: 360 }}
          ></div>
          <Button onClick={buttonClick}>{count}</Button>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          This Project ©2021 Created by qiulin
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
