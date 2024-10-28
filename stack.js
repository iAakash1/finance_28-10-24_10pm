class TransactionNode {
    constructor(amount, type, date, category, description) {
        this.amount = amount; // Amount spent/earned
        this.type = type; // "income" or "expense"
        this.date = date; // Date of the transaction
        this.category = category; // Category of the transaction
        this.description = description; // Description of the transaction
        this.next = null; // Pointer to the next transaction
    }
}

class RemovedNode {
    constructor(transaction) {
        this.transaction = transaction; // Copy of the removed transaction
        this.next = null; // Pointer to the next removed transaction
    }
}

class FinanceTracker {
    constructor() {
        this.top = null; // Top of the stack for transactions
        this.removedTop = null; // Top of the stack for removed transactions
        this.totalTransactions = 0; // Count of all transactions
    }

    // Validating date
    isValidDate(date) {
        // Assuming format YYYY-MM-DD
        if (date.length !== 10 || date[4] !== '-' || date[7] !== '-') {
            //format hi galat hai!
            return false;
        }
        //extracting the year, month and day substr(index, length_to_be_extracted)
        const year = parseInt(date.substr(0, 4), 10);
        const month = parseInt(date.substr(5, 2), 10);
        const day = parseInt(date.substr(8, 2), 10);

        // Check if the year is valid
        if (year < 2000) 
            return false;
        
        // Get the current date
        const now = new Date();
        const currentYear = now.getFullYear();
        // Months are zero indexed
        const currentMonth = now.getMonth() + 1; 
        const currentDay = now.getDate();

        // Check if the input date is valid
        //check for future date
        if (year > currentYear || 
            (year === currentYear && (month > currentMonth || 
            (month === currentMonth && day > currentDay)))) {
            return false;
        }

        return true;
    }

    // Add a new transaction
    addTransaction(amount, type, date, category, description) {
        //if invalid date
        if (!this.isValidDate(date)) {
            console.log("Invalid date. Please enter a date greater than or equal to the year 2000 and less than or equal to today's date.");
            return;
        }

        //add a new node before the current top
        //top ko aage badhao
        const newTransaction = new TransactionNode(amount, type, date, category, description);
        newTransaction.next = this.top; // Add to the top of the stack
        this.top = newTransaction;
        this.totalTransactions++;
        console.log(`Transaction of amount ${amount} added successfully.`);
    }

    // Remove the top transaction
    removeTopTransaction() {
        //stack is empty
        if (this.top === null) {
            console.log("No transactions to remove.");
            return;
        }

        // Save the removed transaction in the removed stack
        const newRemovedNode = new RemovedNode(this.top); // Use copy constructor
        newRemovedNode.next = this.removedTop; // Add to the top of the removed stack
        this.removedTop = newRemovedNode;

        const temp = this.top;
        this.top = this.top.next; // Move top to the next transaction
        console.log(`Transaction of amount ${temp.amount} removed successfully.`);
        this.totalTransactions--;
    }

    // View the last transaction
    viewLastTransaction() {
        //stack empty
        if (this.top === null) {
            console.log("No transactions available.");
            return;
        }
        console.log("Last Transaction: ");
        //print top ka data
        console.log(`Amount: ${this.top.amount}, Type: ${this.top.type}, Date: ${this.top.date}, Category: ${this.top.category}, Description: ${this.top.description}`);
    }

    // Clear all transactions
    clearAllTransactions() {
        //till we don't reach the end of the stack, keep popping
        while (this.top !== null) {
            this.removeTopTransaction(); 
        }
        console.log("All transactions cleared successfully.");
    }

    // Get the balance
    getBalance() {
        let balance = 0.0;
        let curr = this.top;
        while (curr !== null) {
            if (curr.type === "income") {
                balance += curr.amount;
            } else if (curr.type === "expense") {
                balance -= curr.amount;
            }
            curr = curr.next;
        }
        return balance;
    }

    // Display all transactions
    getAllTransactions() {
        //stack empty
        if (this.top === null) {
            console.log("No transactions available.");
            return;
        }
        console.log("All Transactions:");
        let curr = this.top;
        while (curr !== null) {
            //jab tak end of stack nahi ata, keep displaying details
            console.log(`Amount: ${curr.amount}, Type: ${curr.type}, Date: ${curr.date}, Category: ${curr.category}, Description: ${curr.description}`);
            curr = curr.next;
        }
    }

    // Undo the latest removed transaction
    undoLatestRemovedTransaction() {
        //will check in the removedtop ll
        if (this.removedTop === null) {
            console.log("No transactions to undo.");
            return;
        }

        // Create a new transaction node from the removed transaction
        const transactionToRestore = new TransactionNode(
            this.removedTop.transaction.amount,
            this.removedTop.transaction.type,
            this.removedTop.transaction.date,
            this.removedTop.transaction.category,
            this.removedTop.transaction.description
        );

        // Restore it back to the main stack
        const tempRemoved = this.removedTop;
        this.removedTop = this.removedTop.next; // Move removedTop to the next removed transaction

        // Push the transaction back onto the main stack
        transactionToRestore.next = this.top; // Link to the current top
        this.top = transactionToRestore; // Update top
        this.totalTransactions++;

        console.log("Last removed transaction has been undone.");
    }

    // Get total number of transactions
    getTotalTransactions() {
        return this.totalTransactions;
    }

    // Tell if expenses are more than income
    //expense vs income
    tellPositiveOrNegative() {
        let totalIncome = 0.0, totalExpense = 0.0;
        let curr = this.top;
        while (curr !== null) {
            if (curr.type === "income") {
                totalIncome += curr.amount;
            } else if (curr.type === "expense") {
                totalExpense += curr.amount;
            }
            curr = curr.next;
        }

        if (totalExpense > totalIncome) {
            console.log("Expenses are more than income. Good to manage!");
        } else if (totalExpense === totalIncome) {
            console.log("Expenses and income are balanced.");
        } else {
            console.log("Income is more than expenses. Keep saving!");
        }
    }
}

// Main function to interact with the finance tracker
function main() {
    const tracker = new FinanceTracker();
    let choice;

    do {
        console.log("1. Add Transaction");
        console.log("2. Remove Top Transaction");
        console.log("3. View Last Transaction");
        console.log("4. Clear All Transactions");
        console.log("5. Get Balance");
        console.log("6. Get All Transactions");
        console.log("7. Undo Latest Removed Transaction");
        console.log("8. Get Total Transactions");
        console.log("9. Tell if Expenses are More than Income");
        console.log("0. Exit");
        choice = prompt("Enter your choice: ");

        switch (parseInt(choice, 10)) {
            case 1: {
                const amount = parseFloat(prompt("Enter amount (spent/earned): "));
                const type = prompt("Enter type (income/expense): ");
                const date = prompt("Enter date (YYYY-MM-DD): ");
                const category = prompt("Enter category: ");
                const description = prompt("Enter description: ");
                tracker.addTransaction(amount, type, date, category, description);
                break;
            }
            case 2:
                tracker.removeTopTransaction();
                break;
            case 3:
                tracker.viewLastTransaction();
                break;
            case 4:
                tracker.clearAllTransactions();
                break;
            case 5:
                console.log(`Current Balance: ${tracker.getBalance()}`);
                break;
            case 6:
                tracker.getAllTransactions();
                break;
            case 7:
                tracker.undoLatestRemovedTransaction();
                break;
            case 8:
                console.log(`Total Transactions: ${tracker.getTotalTransactions()}`);
                break;
            case 9:
                tracker.tellPositiveOrNegative();
                break;
            case 0:
                console.log("Exiting...");
                break;
            default:
                console.log("Invalid choice. Please try again.");
                break;
        }
    } while (choice !== "0");
}

// Start the application
main();
