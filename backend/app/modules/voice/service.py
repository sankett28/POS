from typing import Dict, Any

class VoiceService:
    async def process_command(self, request: dict) -> Dict[str, Any]:
        """Process voice command"""
        command = request.get("command", "").lower()
        language = request.get("language", "en")
        
        # Simulated responses based on command patterns
        if "stock" in command or "kitna" in command:
            return {
                "success": True,
                "message": "Maggi Noodles: 45 units in stock. Good stock level.",
                "action": "stock-query",
                "data": {"product": "Maggi Noodles", "stock": 45}
            }
        elif "sales" in command or "batao" in command:
            return {
                "success": True,
                "message": "Today's total sales: ₹45,280. Up 12.5% from yesterday.",
                "action": "sales-query",
                "data": {"today": 45280, "trend": 12.5}
            }
        elif "udhar" in command or "credit" in command:
            return {
                "success": True,
                "message": "Credit of ₹200 added to Ravi Kumar's account. Total due: ₹1,200.",
                "action": "credit-add",
                "data": {"customer": "Ravi Kumar", "amount": 200, "totalDue": 1200}
            }
        elif "bill" in command or "banao" in command:
            return {
                "success": True,
                "message": "Bill created for ₹500. Ready to print.",
                "action": "bill-create",
                "data": {"amount": 500}
            }
        
        return {
            "success": True,
            "message": "Command processed",
            "action": None,
            "data": None
        }
