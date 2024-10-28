// TransactionNode and RemovedNode classes
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

// FinanceTracker class with all functions
class FinanceTracker {
    constructor() {
        this.top = null;
        this.removedTop = null;
        this.totalTransactions = 0;
    }

    // Validate the date format and range
    isValidDate(date) {
        if (date.length !== 10 || date[4] !== '-' || date[7] !== '-') return false;

        const year = parseInt(date.substr(0, 4), 10);
        const month = parseInt(date.substr(5, 2), 10);
        const day = parseInt(date.substr(8, 2), 10);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();

        if (year < 2000 || year > currentYear || 
            (year === currentYear && (month > currentMonth || 
            (month === currentMonth && day > currentDay)))) {
            return false;
        }
        return true;
    }

    addTransaction(amount, type, date, category, description) {
        if (!this.isValidDate(date)) {
            alert("Invalid date. Please enter a date from 2000 up to today.");
            return;
        }

        const newTransaction = new TransactionNode(amount, type, date, category, description);
        newTransaction.next = this.top;
        this.top = newTransaction;
        this.totalTransactions++;
        alert(`Transaction of ${type} ${amount} added successfully.`);
    }

    removeTopTransaction() {
        if (this.top === null) {
            alert("No transactions to remove.");
            return;
        }

        const newRemovedNode = new RemovedNode(this.top);
        newRemovedNode.next = this.removedTop;
        this.removedTop = newRemovedNode;

        this.top = this.top.next;
        this.totalTransactions--;
        alert("Top transaction removed successfully.");
    }

    viewLastTransaction() {
        if (this.top === null) {
            alert("No transactions available.");
            return "No transactions available.";
        }
        return `Amount: ${this.top.amount}, Type: ${this.top.type}, Date: ${this.top.date}, Category: ${this.top.category}, Description: ${this.top.description}`;
    }

    clearAllTransactions() {
        while (this.top !== null) {
            this.removeTopTransaction();
        }
        alert("All transactions cleared successfully.");
    }

    getBalance() {
        let balance = 0.0;
        let curr = this.top;
        while (curr) {
            balance += curr.type === "income" ? curr.amount : -curr.amount;
            curr = curr.next;
        }
        return balance;
    }

    getAllTransactions() {
        let curr = this.top;
        const transactions = [];
        while (curr) {
            transactions.push(`Amount: ${curr.amount}, Type: ${curr.type}, Date: ${curr.date}, Category: ${curr.category}, Description: ${curr.description}`);
            curr = curr.next;
        }
        return transactions.length > 0 ? transactions.join("<br>") : "No transactions available.";
    }

    undoLatestRemovedTransaction() {
        if (this.removedTop === null) {
            alert("No transactions to undo.");
            return;
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

        alert("Last removed transaction has been undone.");
    }

    getTotalTransactions() {
        return this.totalTransactions;
    }

    tellPositiveOrNegative() {
        let totalIncome = 0.0, totalExpense = 0.0;
        let curr = this.top;
        while (curr) {
            if (curr.type === "income") totalIncome += curr.amount;
            else totalExpense += curr.amount;
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

// UI Script
document.addEventListener("DOMContentLoaded", () => {
    const tracker = new FinanceTracker();

    document.getElementById("add-transaction").addEventListener("click", () => {
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const date = document.getElementById("date").value;
        const category = document.getElementById("category").value;
        const description = document.getElementById("description").value;

        tracker.addTransaction(amount, type, date, category, description);
        document.getElementById("results").innerHTML = tracker.getAllTransactions();
    });

    document.getElementById("get-balance").addEventListener("click", () => {
        const balance = tracker.getBalance();
        document.getElementById("results").innerHTML = `Current Balance: ${balance}`;
    });

    document.getElementById("view-last-transaction").addEventListener("click", () => {
        document.getElementById("results").innerHTML = tracker.viewLastTransaction();
    });

    document.getElementById("remove-top-transaction").addEventListener("click", () => {
        tracker.removeTopTransaction();
        document.getElementById("results").innerHTML = tracker.getAllTransactions();
    });

    document.getElementById("clear-all-transactions").addEventListener("click", () => {
        tracker.clearAllTransactions();
        document.getElementById("results").innerHTML = "All transactions have been cleared.";
    });

    document.getElementById("undo-transaction").addEventListener("click", () => {
        tracker.undoLatestRemovedTransaction();
        document.getElementById("results").innerHTML = tracker.getAllTransactions();
    });

    document.getElementById("total-transactions").addEventListener("click", () => {
        document.getElementById("results").innerHTML = `Total Transactions: ${tracker.getTotalTransactions()}`;
    });

    document.getElementById("expense-analysis").addEventListener("click", () => {
        document.getElementById("results").innerHTML = tracker.tellPositiveOrNegative();
    });
});
