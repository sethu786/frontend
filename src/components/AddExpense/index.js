import {Component} from 'react'
import {ExpenseContext} from '../../context/ExpenseContext'
import './index.css'

class AddExpense extends Component {
  state = {
    title: '',
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (addExpense, e) => {
    e.preventDefault()
    const {title, amount, category, date, paymentMethod} = this.state
    if (!title || !amount || !category || !date || !paymentMethod) {
      alert('Please fill in all fields.')
      return
    }

    addExpense(this.state)
    this.setState({
      title: '',
      amount: '',
      category: '',
      date: '',
      paymentMethod: '',
    })
  }

  navigateToExpenseList = () => {
    const {history} = this.props
    history.push('/expenses')
  }

  render() {
    const {title, amount, category, date, paymentMethod} = this.state
    return (
      <ExpenseContext.Consumer>
        {({addExpense}) => (
          <div className="add-expense-container">
            <h2 className="title">Add Expense</h2>
            <form
              className="expense-form"
              onSubmit={e => this.handleSubmit(addExpense, e)}
            >
              <input
                className="input"
                name="title"
                placeholder="Title"
                value={title}
                onChange={this.handleChange}
              />
              <input
                className="input"
                name="amount"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={this.handleChange}
              />
              <input
                className="input"
                name="category"
                placeholder="Category"
                value={category}
                onChange={this.handleChange}
              />
              <input
                className="input"
                name="date"
                type="date"
                value={date}
                onChange={this.handleChange}
              />
              <input
                className="input"
                name="paymentMethod"
                placeholder="Payment Method"
                value={paymentMethod}
                onChange={this.handleChange}
              />

              <div className="button-group">
                <button className="submit-btn" type="submit">
                  Add Expense
                </button>
                <button
                  className="clear-btn"
                  type="button"
                  onClick={() =>
                    this.setState({
                      title: '',
                      amount: '',
                      category: '',
                      date: '',
                      paymentMethod: '',
                    })
                  }
                >
                  Clear
                </button>
                <button
                  className="view-expense-btn"
                  type="button"
                  onClick={this.navigateToExpenseList}
                >
                  View Expenses
                </button>
              </div>
            </form>
          </div>
        )}
      </ExpenseContext.Consumer>
    )
  }
}

export default AddExpense

