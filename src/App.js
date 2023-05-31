import {BrowserRouter, Route, Switch} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobsItemsDetails from './components/JobsItemsDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={LoginForm} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute path="/jobs" component={Jobs} />

      <ProtectedRoute path="/jobs/:id" component={JobsItemsDetails} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default App
