import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import ExpenseDetails from './components/ExpenseDetails';
import ExpenseProvider from './context/ExpenseContext';
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css';

const App = () => (
  <Router>
    <ExpenseProvider>
      <Switch>
       <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={AddExpense} />
        <ProtectedRoute exact path="/expenses" component={ExpenseList} />
        <ProtectedRoute path="/expense-details/:id" component={ExpenseDetails} />
        <ProtectedRoute path="/add-expense" component={AddExpense} />
      </Switch>
    </ExpenseProvider>
  </Router>
);

export default App;
