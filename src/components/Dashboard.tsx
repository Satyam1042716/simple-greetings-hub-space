import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenses } from '@/context/ExpenseContext';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import ExpenseChart from './ExpenseChart';
import CategoryChart from './CategoryChart';
import ExpenseList from './ExpenseList';

const Dashboard = () => {
  const { state } = useExpenses();

  // Calculate totals
  const totalIncome = state.expenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpenses = state.expenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  // Calculate budget utilization
  const budgetUtilization = state.budgets.reduce((acc, budget) => {
    if (budget.limit > 0) {
      acc += (budget.spent / budget.limit) * 100;
    }
    return acc;
  }, 0) / state.budgets.length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
          <p className="text-muted-foreground">Monitor your spending and stay within budget</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="financial-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-income" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-income">
                ${totalIncome.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="financial-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-expense" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="financial-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-income' : 'text-expense'}`}>
                ${Math.abs(netIncome).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {netIncome >= 0 ? 'Positive' : 'Negative'} cash flow
              </p>
            </CardContent>
          </Card>

          <Card className="financial-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
              <PieChart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {budgetUtilization.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Average across categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Monthly Spending Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseChart />
            </CardContent>
          </Card>

          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card className="financial-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;