import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useExpenses } from '@/context/ExpenseContext';
import { subDays, format, startOfDay, isAfter, isBefore } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseChart = () => {
  const { state } = useExpenses();

  // Get data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return startOfDay(date);
  });

  const chartData = last7Days.map(day => {
    const dayExpenses = state.expenses.filter(expense => {
      const expenseDate = startOfDay(new Date(expense.date));
      return expenseDate.getTime() === day.getTime();
    });

    const income = dayExpenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const expenses = dayExpenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      date: format(day, 'MMM dd'),
      income,
      expenses,
    };
  });

  const data = {
    labels: chartData.map(d => d.date),
    datasets: [
      {
        label: 'Income',
        data: chartData.map(d => d.income),
        backgroundColor: 'hsl(158 65% 45%)',
        borderColor: 'hsl(158 65% 45%)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: chartData.map(d => d.expenses),
        backgroundColor: 'hsl(0 65% 55%)',
        borderColor: 'hsl(0 65% 55%)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'hsl(215 25% 20%)',
          font: {
            size: 12,
          },
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
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(215 15% 55%)',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(215 20% 92%)',
        },
        ticks: {
          color: 'hsl(215 15% 55%)',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;