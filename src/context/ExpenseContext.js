import {Component, createContext} from 'react'

export const ExpenseContext = createContext() // Named export for Context

class ExpenseProvider extends Component {
  state = {
    expenses: [
      {
        id: 1,
        title: 'Groceries',
        amount: 50,
        category: 'Food',
        date: '2025-02-15',
        paymentMethod: 'Credit Card',
      },
      {
        id: 2,
        title: 'Transport',
        amount: 20,
        category: 'Travel',
        date: '2025-02-14',
        paymentMethod: 'Cash',
      },
    ],
  }

  addExpense = newExpense => {
    this.setState(prevState => ({
      expenses: [...prevState.expenses, {...newExpense, id: Date.now()}],
    }))
  }

  deleteExpense = id => {
    this.setState(prevState => ({
      expenses: prevState.expenses.filter(expense => expense.id !== id),
    }))
  }

  updateExpense = updatedExpense => {
    this.setState(prevState => ({
      expenses: prevState.expenses.map(expense =>
        expense.id === updatedExpense.id ? updatedExpense : expense,
      ),
    }))
  }

  render() {
    const {expenses} = this.state
    const {children} = this.props

    return (
      <ExpenseContext.Provider
        value={{
          expenses,
          addExpense: this.addExpense,
          deleteExpense: this.deleteExpense,
          updateExpense: this.updateExpense,
        }}
      >
        {children}
      </ExpenseContext.Provider>
    )
  }
}

export default ExpenseProvider // Default export for Provider
