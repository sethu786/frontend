import {Component} from 'react'
import {Link} from 'react-router-dom'
import {ExpenseContext} from '../../context/ExpenseContext'
import './index.css'

class ExpenseDetails extends Component {
  render() {
    const {expenses} = this.context
    const {match} = this.props
    const expenseId = parseInt(match.params.id, 10)
    const expense = expenses.find(exp => exp.id === expenseId)

    if (!expense) {
      return <p className="error-message">Expense not found!</p>
    }

    return (
      <div className="expense-details-container">
        <h2 className="title">Expense Details</h2>
        <div className="details-card">
          <p>
            <strong>Title:</strong> {expense.title}
          </p>
          <p>
            <strong>Amount:</strong> ${expense.amount}
          </p>
          <p>
            <strong>Category:</strong> {expense.category}
          </p>
          <p>
            <strong>Date:</strong> {expense.date}
          </p>
          <p>
            <strong>Payment Method:</strong> {expense.paymentMethod}
          </p>
        </div>
        <Link to="/expenses">
          <button type="button" className="back-btn">
            Back to Expense List
          </button>
        </Link>
      </div>
    )
  }
}

ExpenseDetails.contextType = ExpenseContext

export default ExpenseDetails
