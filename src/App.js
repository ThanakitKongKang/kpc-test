import React from 'react';
import './App.css';
import { Layout } from 'antd';
import HomePage from './components/HomePage'
import EditPage from './components/EditPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const { Content, Header } = Layout;
function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact >
          <Layout>
            <Content className="container">
              <HomePage />
            </Content>
          </Layout>
        </Route>
        <Route path='/edit/:id' >
          <Layout>
            <Content className="container">
              <EditPage />
            </Content>
          </Layout>
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
