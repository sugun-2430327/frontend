import React, { useEffect, useState } from "react";
// import { fetchPayments } from "../services/api";

function Payments() {
  const [payments, setPayments] = useState([]);

  // useEffect(() => {
  //   fetchPayments().then((res) => setPayments(res.data));
  // }, []);

  return (
    <div className="page">
      <h1>Payments</h1>
      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Policy ID</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.paymentId}>
              <td>{payment.paymentId}</td>
              <td>{payment.paymentAmount}</td>
              <td>{payment.paymentDate}</td>
              <td>{payment.paymentStatus}</td>
              <td>{payment.policyId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payments;
