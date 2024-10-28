class TransactionNode {
    constructor(amount, type, date, category, description) {
        this.amount = amount;
        this.type = type; 
        this.date = date; 
        this.category = category; 
        this.description = description; 
        this.next = null; 
    }
}

class RemovedNode {
    constructor(transaction) {
        this.transaction = transaction; 
        this.next = null; 
    }
}

class FinanceTracker {
    constructor() {
        this.top = null; 
        this.removedTop = null; 
        this.totalTransactions = 0; 
    }

    isValidDate(date) {
        if (date.length !== 10 || date[4] !== '-' || date[7] !== '-') {
            return false;
        }
        const year = parseInt(date.substr(0, 4), 10);
        const month = parseInt(date.substr(5, 2), 10);
        const day = parseInt(date.substr(8, 2), 10);
        if (year < 2000) return false;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();

        if (year > currentYear || (year === currentYear && (month > currentMonth || (month === currentMonth && day > currentDay)))) {
            return false;
        }
        return true;
    }

    addTransaction(amount, type, date, category, description) {
        if (!this.isValidDate(date)) {
            return "Invalid date. Please enter a date greater than or equal to the year 2000 and less than or equal to today's date.";
        }
        const newTransaction = new TransactionNode(amount, type, date, category, description);
        newTransaction.next = this.top; 
        this.top = newTransaction; 
        this.totalTransactions++;
        return `Transaction of amount ${amount} added successfully.`;
    }

    removeTopTransaction() {
        if (this.top === null) {
            return "No transactions to remove.";
        }
        const newRemovedNode = new RemovedNode(this.top); 
        newRemovedNode.next = this.removedTop; 
        this.removedTop = newRemovedNode; 
        this.top = this.top.next; 
        this.totalTransactions--; 
        return `Transaction of amount ${newRemovedNode.transaction.amount} removed successfully.`;
    }

    viewLastTransaction() {
        if (this.top === null) {
            return "No transactions available.";
        }
        return `Last Transaction: Amount: ${this.top.amount}, Type: ${this.top.type}, Date: ${this.top.date}, Category: ${this.top.category}, Description: ${this.top.description}`;
    }

    clearAllTransactions() {
        while (this.top !== null) {
            this.removeTopTransaction();
        }
        return "All transactions cleared successfully.";
    }

    getBalance() {
        let balance = 0.0;
        let curr = this.top;
        while (curr !== null) {
            if (curr.type === "income") {
                balance += curr.amount;
            } else {
                balance -= curr.amount;
            }
            curr = curr.next;
        }
        return balance;
    }

    getAllTransactions() {
        if (this.top === null) {
            return "No transactions available.";
        }
        let transactions = "All Transactions:\n";
        let curr = this.top;
        while (curr !== null) {
            transactions += `Amount: ${curr.amount}, Type: ${curr.type}, Date: ${curr.date}, Category: ${curr.category}, Description: ${curr.description}\n`;
            curr = curr.next;
        }
        return transactions;
    }

    undoLatestRemovedTransaction() {
        if (this.removedTop === null) {
            return "No transactions to undo.";
        }
        const transactionToRestore = new TransactionNode(
            this.removedTop.transaction.amount,
            this.removedTop.transaction.type,
            this.removedTop.transaction.date,
            this.removedTop.transaction.category,
            this.removedTop.transaction.description
        );
        this.removedTop = this.removedTop.next; 
        transactionToRestore.next = this.top; 
        this.top = transactionToRestore; 
        this.totalTransactions++; 
        return "Last removed transaction has been undone.";
    }

    getTotalTransactions() {
        return this.totalTransactions;
    }

    tellPositiveOrNegative() {
        let totalIncome = 0.0, totalExpense = 0.0;
        let curr = this.top;
        while (curr !== null) {
            if (curr.type === "income") {
                totalIncome += curr.amount;
            } else {
                totalExpense += curr.amount;
            }
            curr = curr.next;
        }
        if (totalExpense > totalIncome) {
            return "Expenses are more than income. Good to manage!";
        } else if (totalExpense === totalIncome) {
            return "Expenses and income are balanced.";
        } else {
            return "Income is more than expenses. Keep saving!";
        }
    }
}

// Initialize finance tracker
const tracker = new FinanceTracker();

// Update output function for better display
function updateOutput(message) {
    const outputArea = document.getElementById('output');
    outputArea.innerText = message;
}

// Event listeners for buttons
document.getElementById('addTransaction').onclick = function () {
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    const result = tracker.addTransaction(amount, type, date, category, description);
    updateOutput(result);
};

document.getElementById('viewLastTransaction').onclick = function () {
    const result = tracker.viewLastTransaction();
    updateOutput(result);
};

document.getElementById('removeTransaction').onclick = function () {
    const result = tracker.removeTopTransaction();
    updateOutput(result);
};

document.getElementById('clearTransactions').onclick = function () {
    const result = tracker.clearAllTransactions();
    updateOutput(result);
};

document.getElementById('getBalance').onclick = function () {
    const balance = tracker.getBalance();
    updateOutput(`Current Balance: ${balance}`);
};

document.getElementById('getAllTransactions').onclick = function () {
    const result = tracker.getAllTransactions();
    updateOutput(result);
};

document.getElementById('undoTransaction').onclick = function () {
    const result = tracker.undoLatestRemovedTransaction();
    updateOutput(result);
};

document.getElementById('getTotalTransactions').onclick = function () {
    const total = tracker.getTotalTransactions();
    updateOutput(`Total Transactions: ${total}`);
};

document.getElementById('checkBalanceStatus').onclick = function () {
    const status = tracker.tellPositiveOrNegative();
    updateOutput(status);
};
