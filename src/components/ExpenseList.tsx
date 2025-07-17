import React, { useState } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign
} from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import { format } from 'date-fns';

const ExpenseList = () => {
  const { state, dispatch } = useExpenses();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDeleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...state.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Show only recent 10 expenses
  const recentExpenses = sortedExpenses.slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {recentExpenses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No transactions yet</p>
          <p className="text-sm">Start by adding your first income or expense</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="expense-item flex items-center justify-between p-4 bg-card rounded-lg border border-border"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  expense.type === 'income' 
                    ? 'bg-income/10 text-income' 
                    : 'bg-expense/10 text-expense'
                }`}>
                  {expense.type === 'income' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {expense.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className={`text-lg font-semibold ${
                  expense.type === 'income' 
                    ? 'text-income' 
                    : 'text-expense'
                }`}>
                  {expense.type === 'income' ? '+' : '-'}${expense.amount.toLocaleString()}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="text-muted-foreground hover:text-expense"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedExpenses.length > 10 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing 10 of {sortedExpenses.length} transactions
          </p>
        </div>
      )}

      <AddExpenseModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </div>
  );
};

export default ExpenseList;