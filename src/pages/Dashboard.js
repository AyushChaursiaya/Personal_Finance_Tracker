import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
import TransactionsTable from '../components/TransactionsTable';
import React, { useEffect, useState } from 'react'
import NoTransactions from '../NoTransaction';
import Header from '../components/Header';
import Cards from '../components/Cards';
import ChartComponent from '../Charts';


function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  function reset() {
    setIncome(0);
    setExpense(0);
    setBalance(0);
    setTransactions([]);
    toast.success("reset successfully");
    console.log("resetting");
  }

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };



  const addTransaction = async (transaction, many) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many)
        toast.success("Transaction Added!");
      let newArray = transactions;
      newArray.push(transaction);
      setTransactions(newArray);
      // setTransactions([...transactions, transaction]);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many)
        toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user])





  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setBalance(incomeTotal - expensesTotal);
  };

  // Calculate the initial balance, income, and expenses
  useEffect(() => {
    calculateBalance();
  }, [transactions])



  const fetchTransactions = async () => {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array", transactionsArray);
      // toast.success("Transactions Fetched!");
      transactionsArray ? (toast.success("Transactions Fetched!")) : toast.success("reset successfully");
    }
    setLoading(false);
  }



  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  })


  return (
    <div style={{ overflowX: "hidden" }}>
      <Header />
      {
        loading ?
          (<p>loading...</p>) :
          (<>
            <Cards
              income={income}
              expense={expense}
              balance={balance}
              reset={reset}
              showExpenseModal={showExpenseModal}
              showIncomeModal={showIncomeModal} />

              {/* {transactions.length != 0 ? <ChartComponent sortedTransactions={sortedTransactions} transactions={transactions} /> : <NoTransactions />} */}
              {transactions.length != 0 ? <ChartComponent sortedTransactions={sortedTransactions} transactions={transactions} /> : <NoTransactions />}

              <AddExpenseModal
                isExpenseModalVisible={isExpenseModalVisible}
                handleExpenseCancel={handleExpenseCancel}
                onFinish={onFinish} />

              <AddIncomeModal
                isIncomeModalVisible={isIncomeModalVisible}
                handleIncomeCancel={handleIncomeCancel}
                onFinish={onFinish} />

              <TransactionsTable
                transactions={transactions}
                addTransaction={addTransaction}
                fetchTransactions={fetchTransactions} />
          </>)
      }
    </div>
  )
}

export default Dashboard;
