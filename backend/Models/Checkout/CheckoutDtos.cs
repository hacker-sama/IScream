#nullable enable

namespace IScream.Models
{
    // --- Checkout DTOs ---
    /// <summary>Step 1: create checkout with order details (returns checkoutId = orderId)</summary>
    public class CreateCheckoutRequest
    {
        public string CustomerName { get; set; } = null!;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public Guid ItemId { get; set; }
        public int Quantity { get; set; } = 1;
    }

    /// <summary>Step 2: provide card details to complete payment</summary>
    public class PayCheckoutRequest
    {
        public string CardNumber { get; set; } = null!;
        public string Expiry { get; set; } = null!;   // MM/YY
        public string Cvv { get; set; } = null!;
    }

    public class CheckoutResult
    {
        public Guid CheckoutId { get; set; }   // same as orderId
        public string OrderNo { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "VND";
        public string OrderStatus { get; set; } = null!;
        public string PaymentStatus { get; set; } = null!;
        public string? CardLast4 { get; set; }
    }
}
