import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

interface ExpenseState {
  expenses: Expense[];
  budgets: Budget[];
  categories: string[];
}

type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'LOAD_DATA'; payload: ExpenseState };

const initialCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Groceries',
  'Other'
];

const initialState: ExpenseState = {
  expenses: [],
  budgets: initialCategories.map(cat => ({ category: cat, limit: 1000, spent: 0 })),
  categories: initialCategories,
};

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'ADD_EXPENSE':
      const newExpenses = [...state.expenses, action.payload];
      const updatedBudgets = state.budgets.map(budget => {
        if (budget.category === action.payload.category && action.payload.type === 'expense') {
          return { ...budget, spent: budget.spent + action.payload.amount };
        }
        return budget;
      });
      return {
        ...state,
        expenses: newExpenses,
        budgets: updatedBudgets,
      };

    case 'DELETE_EXPENSE':
      const expenseToDelete = state.expenses.find(e => e.id === action.payload);
      const remainingExpenses = state.expenses.filter(e => e.id !== action.payload);
      
      let adjustedBudgets = state.budgets;
      if (expenseToDelete && expenseToDelete.type === 'expense') {
        adjustedBudgets = state.budgets.map(budget => {
          if (budget.category === expenseToDelete.category) {
            return { ...budget, spent: Math.max(0, budget.spent - expenseToDelete.amount) };
          }
          return budget;
        });
      }
      
      return {
        ...state,
        expenses: remainingExpenses,
        budgets: adjustedBudgets,
      };

    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.category === action.payload.category ? action.payload : budget
        ),
      };

    case 'LOAD_DATA':
      return action.payload;

    default:
      return state;
  }
}

const ExpenseContext = createContext<{
  state: ExpenseState;
  dispatch: React.Dispatch<ExpenseAction>;
} | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('expenseTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('expenseTrackerData', JSON.stringify(state));
  }, [state]);

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}