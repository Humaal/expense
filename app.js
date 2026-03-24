  document.addEventListener('DOMContentLoaded', () => {

    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year')
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart');

    let selectedMonth;
    let selectedYear;
    let myChart;

    // Generate year options dynamically
    for (let year = 2020; year <= 2040; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }


    // Initialize expenses object with categories
    const expenses = {
        January:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        February:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        March:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        April:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        May:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        June:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        July:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        August:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        September:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        October:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        November:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        December:{ Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
    };


// Load Expenses
 function getExpensesFromLocalStorage(month, year) {
        const key = `${month}-${year}`;
        return JSON.parse(localStorage.getItem(key)) || {};
    }


// Save Expenses
    function saveExpensesToLocalStorage(month, year) {
        const key = `${month}-${year}`;
        localStorage.setItem(key, JSON.stringify(expenses[month]));
    }

// Get selected month & year
    function getSelectedMonthYear() {
        selectedMonth = monthSelect.value;
        selectedYear = yearSelect.value;

        if (!selectedMonth || !selectedYear) return false;
        return true;
    }



    // Update chart
    function updateChart() {
        if (!getSelectedMonthYear()) return;

        const expenseData = getExpensesFromLocalStorage(selectedMonth, selectedYear);
        Object.assign(expenses[selectedMonth], expenseData);

        const ctx = expenseChart.getContext('2d');

        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(expenses[selectedMonth]),
                datasets: [{
                    label: 'Expenses',
                    data: Object.values(expenses[selectedMonth]),
                    backgroundColor: ['#FF6384','#4CAF50','#FFCE56','#36A2EB','#FF9F40']
                }]
            },
            options: {
                responsive: true
            }
        });
    }


    // Handle form submission
    function handleSubmit(event) {
        event.preventDefault();

        if (!getSelectedMonthYear()) return;

        const category = event.target.category.value;
        const amount = parseFloat(event.target.amount.value);

        if (isNaN(amount)) {
            alert('Enter valid amount');
            return;
        }

        const currentAmount = expenses[selectedMonth][category] || 0;

        if (amount >= 0) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else if (currentAmount >= Math.abs(amount)) {
            expenses[selectedMonth][category] = currentAmount + amount;
        } else {
            alert('Cannot go below zero');
            return;
        }

        saveExpensesToLocalStorage(selectedMonth, selectedYear);
        amountInput.value = '';

        updateChart();
    }

    expenseForm.addEventListener('submit', handleSubmit);
    monthSelect.addEventListener('change', updateChart);
    yearSelect.addEventListener('change', updateChart);

    // Set default month and year based on current month and year
    function setDefaultMonthYear() {
        const now = new Date();
        monthSelect.value = now.toLocaleString('default', { month: 'long' });
        yearSelect.value = now.getFullYear();
    }

    setDefaultMonthYear();
    updateChart();
});