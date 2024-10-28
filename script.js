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
        this.removedTop = null;
        this.totalTransactions = 0;
    }

    addTransaction(amount, type, date, category, description) {
        const transaction = new TransactionNode(amount, type, date, category, description);
        transaction.next = this.top;
        this.top = transaction;
        this.totalTransactions++;
        this.displayMessage(`Transaction Added: ${amount} - ${type} on ${date}`);
    }

    removeTopTransaction() {
        if (!this.top) {
            this.displayMessage("No transactions to remove.");
            return;
        }
        this.top = this.top.next;
        this.totalTransactions--;
        this.displayMessage("Top transaction removed.");
    }

    viewLastTransaction() {
        if (!this.top) {
            this.displayMessage("No transactions available.");
            return;
        }
        this.displayMessage(`Last Transaction: ${this.top.amount} - ${this.top.type} on ${this.top.date}`);
    }

    clearAllTransactions() {
        this.top = null;
        this.totalTransactions = 0;
        this.displayMessage("All transactions cleared.");
    }

    getBalance() {
        let balance = 0;
        let curr = this.top;
        while (curr) {
            balance += curr.type === "income" ? curr.amount : -curr.amount;
            curr = curr.next;
        }
        this.displayMessage(`Current Balance: ${balance}`);
    }

    getAllTransactions() {
        if (!this.top) {
            this.displayMessage("No transactions available.");
            return;
        }
        let curr = this.top;
        let allTransactions = "All Transactions:\n";
        while (curr) {
            allTransactions += `${curr.amount} - ${curr.type} on ${curr.date}\n`;
            curr = curr.next;
        }
        this.displayMessage(allTransactions);
    }

    undoLatestRemovedTransaction() {
        if (!this.removedTop) {
            this.displayMessage("No transactions to undo.");
            return;
        }
        const transaction = this.removedTop.transaction;
        this.addTransaction(transaction.amount, transaction.type, transaction.date, transaction.category, transaction.description);
        this.removedTop = this.removedTop.next;
        this.displayMessage("Last removed transaction undone.");
    }

    getTotalTransactions() {
        this.displayMessage(`Total Transactions: ${this.totalTransactions}`);
    }

    tellPositiveOrNegative() {
        let income = 0, expense = 0;
        let curr = this.top;
        while (curr) {
            if (curr.type === "income") income += curr.amount;
            else expense += curr.amount;
            curr = curr.next;
        }
        const message = expense > income ? "Expenses exceed income." :
                        expense < income ? "Income exceeds expenses." :
                        "Income equals expenses.";
        this.displayMessage(message);
    }

    displayMessage(message) {
        document.getElementById("results").innerText = message;
    }
}

const tracker = new FinanceTracker();

function addTransaction() {
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    tracker.addTransaction(amount, type, date, category, description);
}

function removeTopTransaction() { tracker.removeTopTransaction(); }
function viewLastTransaction() { tracker.viewLastTransaction(); }
function clearAllTransactions() { tracker.clearAllTransactions(); }
function getBalance() { tracker.getBalance(); }
function getAllTransactions() { tracker.getAllTransactions(); }
function undoLatestRemovedTransaction() { tracker.undoLatestRemovedTransaction(); }
function getTotalTransactions() { tracker.getTotalTransactions(); }
function tellPositiveOrNegative() { tracker.tellPositiveOrNegative(); }
