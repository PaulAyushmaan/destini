from typing import Dict, Optional
from datetime import datetime
import random

class PaymentService:
    def __init__(self):
        self.transactions = {}
        
    def process_payment(self, amount: float, user_id: str, ride_id: str) -> Dict:
        """Process a mock payment and return transaction details."""
        # Simulate payment processing
        success = random.random() > 0.1  # 90% success rate
        
        transaction_id = f"TXN{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000, 9999)}"
        
        transaction = {
            "transaction_id": transaction_id,
            "amount": amount,
            "user_id": user_id,
            "ride_id": ride_id,
            "status": "success" if success else "failed",
            "timestamp": datetime.utcnow(),
            "payment_method": "mock_payment",
            "error_message": None if success else "Payment processing failed"
        }
        
        self.transactions[transaction_id] = transaction
        return transaction
        
    def get_transaction(self, transaction_id: str) -> Optional[Dict]:
        """Retrieve transaction details by ID."""
        return self.transactions.get(transaction_id)
        
    def refund_payment(self, transaction_id: str) -> Dict:
        """Process a mock refund."""
        transaction = self.get_transaction(transaction_id)
        if not transaction:
            return {"status": "failed", "error": "Transaction not found"}
            
        if transaction["status"] != "success":
            return {"status": "failed", "error": "Cannot refund failed transaction"}
            
        # Create refund transaction
        refund_id = f"REF{datetime.now().strftime('%Y%m%d%H%M%S')}{random.randint(1000, 9999)}"
        refund = {
            "transaction_id": refund_id,
            "amount": transaction["amount"],
            "user_id": transaction["user_id"],
            "ride_id": transaction["ride_id"],
            "status": "success",
            "timestamp": datetime.utcnow(),
            "payment_method": "mock_refund",
            "original_transaction_id": transaction_id
        }
        
        self.transactions[refund_id] = refund
        return refund 