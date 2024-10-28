// FinanceTracker Class
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

class FinanceTracker {
    constructor() {
        this.top = null;
    }

    // Validate the date format
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
        alert(`Transaction of ${type} ${amount} added successfully.`);
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
        return transactions;
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
        document.getElementById("results").innerHTML = tracker.getAllTransactions().join("<br>");
    });

    document.getElementById("get-balance").addEventListener("click", () => {
        const balance = tracker.getBalanc
