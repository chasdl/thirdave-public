import React from 'react'
// import './App.css'
import './tailwind.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Pray from './components/pray'
import Login from './components/login'
import Register from './components/register'
import Partners from './components/partners'
import Home from './components/home'
import Profile from './components/profile'
import { Navigation } from './components/layout/navigation'

function App() {
  return (
    <Router>
        <Navigation />
        <Switch>
          <Route path="/pray" component={Pray} />
          <Route path="/partners" component={Partners} />
          <Route path="/profile" component={Profile} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Home} />
      </Switch>
    </Router>
  )
}

export default App
