import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useExpenses } from '@/context/ExpenseContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const { state } = useExpenses();

  // Calculate expenses by category
  const categoryData = state.categories.map(category => {
    const categoryExpenses = state.expenses
      .filter(expense => expense.category === category && expense.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      category,
      amount: categoryExpenses,
    };
  }).filter(item => item.amount > 0);

  const colors = [
    'hsl(214 85% 45%)',  // Primary blue
    'hsl(158 65% 45%)',  // Success green
    'hsl(45 85% 55%)',   // Warning yellow
    'hsl(280 65% 55%)',  // Purple
    'hsl(25 85% 55%)',   // Orange
    'hsl(340 75% 55%)',  // Pink
    'hsl(200 75% 55%)',  // Light blue
    'hsl(120 45% 55%)',  // Forest green
    'hsl(60 75% 55%)',   // Lime
    'hsl(300 55% 55%)',  // Magenta
  ];

  const data = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        data: categoryData.map(item => item.amount),
        backgroundColor: colors.slice(0, categoryData.length),
        borderColor: colors.slice(0, categoryData.length).map(color => color.replace('55%)', '35%)')),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'hsl(215 25% 20%)',
          font: {
            size: 11,
          },
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(0 0% 100%)',
        titleColor: 'hsl(215 25% 20%)',
        bodyColor: 'hsl(215 25% 20%)',
        borderColor: 'hsl(215 20% 88%)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (categoryData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No expenses to display</p>
          <p className="text-sm">Add some expenses to see your spending breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <Pie data={data} options={options} />
    </div>
  );
};

export default CategoryChart;