import {Component} from 'react'
import {Link} from 'react-router-dom'
import {ExpenseContext} from '../../context/ExpenseContext'
import './index.css'

class ExpenseList extends Component {
  state = {
    updatingExpense: null,
  }

  deleteExpense = id => {
    const {deleteExpense} = this.context

    if (!id) {
      console.error('Error: Expense ID is missing!')
      return
    }

    console.log('Attempting to delete expense with ID:', id)
    deleteExpense(id)
  }

  updateExpense = expense => {
    this.setState({updatingExpense: expense})
  }

  handleInputChange = e => {
    this.setState(({updatingExpense}) => ({
      updatingExpense: {
        ...updatingExpense,
        [e.target.name]: e.target.value,
      },
    }))
  }

  handleUpdateSubmit = e => {
    e.preventDefault()
    const {updateExpense} = this.context
    const {updatingExpense} = this.state

    updateExpense(updatingExpense)
    this.setState({updatingExpense: null})
  }

  render() {
    const {expenses} = this.context
    const {updatingExpense} = this.state

    return (
      <div className="expense-list-container">
        <h2 className="title">Expense List</h2>

        {expenses.length === 0 ? (
          <p className="empty-message">No expenses available.</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id} className="table-row">
                  <td>{expense.title}</td>
                  <td>${expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>{expense.date}</td>
                  <td>{expense.paymentMethod}</td>
                  <td className="button-group">
                    <button
                      type="button"
                      className="update-btn"
                      onClick={() => this.updateExpense(expense)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => this.deleteExpense(expense.id)}
                    >
                      Delete
                    </button>
                    <Link to={`/expense-details/${expense.id}`}>
                      <button type="button" className="view-details-btn">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {updatingExpense && (
          <form className="update-form" onSubmit={this.handleUpdateSubmit}>
            <h3>Update Expense</h3>
            <input
              name="title"
              className="form-input"
              placeholder="Title"
              value={updatingExpense.title}
              onChange={this.handleInputChange}
              required
            />
            <input
              name="amount"
              className="form-input"
              type="text"
              placeholder="Amount"
              value={updatingExpense.amount}
              onChange={this.handleInputChange}
              required
            />
            <input
              name="category"
              className="form-input"
              placeholder="Category"
              value={updatingExpense.category}
              onChange={this.handleInputChange}
              required
            />
            <input
              name="date"
              className="form-input"
              type="date"
              value={updatingExpense.date}
              onChange={this.handleInputChange}
              required
            />
            <input
              name="paymentMethod"
              className="form-input"
              placeholder="Payment Method"
              value={updatingExpense.paymentMethod}
              onChange={this.handleInputChange}
              required
            />

            <div className="button-group">
              <button type="submit" className="back-btn">
                Save Update
              </button>
              <button
                type="button"
                className="back-btn"
                onClick={() => this.setState({updatingExpense: null})}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <Link to="/">
          <button type="button" className="back-btn">Back to Add Expense</button>
        </Link>
      </div>
    )
  }
}

ExpenseList.contextType = ExpenseContext

export default ExpenseList

