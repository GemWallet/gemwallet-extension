export interface Payment {
  // 	The amount of currency to deliver (in drops)
  amount: string;
  // The unique address of the account receiving the payment
  destination: string;
}
