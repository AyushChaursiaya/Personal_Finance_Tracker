import { Line, Pie } from '@ant-design/charts';
import { Card, Row } from 'antd';
import moment from 'moment';
import React from 'react'

function ChartComponent({ sortedTransactions, transactions }) {

  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  })

  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === 'expense') {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });


  // let finalSpendings = spendingData.reduce((acc, obj) => {
  //     let key = obj.tag;
  //     if (!acc[key]) {
  //         acc[key] = { tag: obj.tag, amount: obj.amount };
  //     } else {
  //         acc[key].amount += obj.amount;
  //     }
  //     return acc;
  // }, {});


  let newSpendings = [
    { tag: "food", amount: 0 },
    { tag: "education", amount: 0 },
    { tag: "office", amount: 0 }
  ]

  spendingData.forEach((item) => {
    if (item.tag == "food") {
      newSpendings[0].amount += item.amount;
    } else if (item.tag == "education") {
      newSpendings[1].amount += item.amount;
    } else {
      newSpendings[2].amount += item.amount;
    }
  });


  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance +=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
  };


  let chart;
  let pieChart;

  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };
  return (
    <div className='chart-wrapper'>
      <Row gutter={16}>
        <Card bordered={true} style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Financial Statistics</h2>
          {/* <Line {...config} onReady={(chartInstance) => (chart = chartInstance)}/> */}
          <Line {...{ ...balanceConfig, data: balanceData }} />
        </Card>
        <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
          <h2>Total Spendings</h2>
          {spendingDataArray.length == 0 ? (
            <p>Seems like you haven't spent anything till now...</p>
          ) : (
            // <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
            <Pie {...spendingConfig} data={spendingDataArray} />
          )}

        </Card>
      </Row>
    </div >
  )
}

export default ChartComponent;
