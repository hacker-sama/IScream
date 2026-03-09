// =============================================================================
// CheckoutService — Unified checkout: create order + payment in one place
// POST /api/checkout         → creates order (PENDING) + payment (PENDING)
// POST /api/checkout/{id}/pay → validates card, sets order→PROCESSING, payment→SUCCESS
// =============================================================================
#nullable enable

using System.Text.RegularExpressions;
using IScream.Data;
using IScream.Models;

namespace IScream.Services
{
    public interface ICheckoutService
    {
        Task<(CheckoutResult? result, string error)> CreateAsync(Guid userId, CreateCheckoutRequest req);
        Task<(CheckoutResult? result, string error)> PayAsync(Guid orderId, Guid userId, PayCheckoutRequest req);
    }

    public class CheckoutService : ICheckoutService
    {
        private readonly IAppRepository _repo;

        public CheckoutService(IAppRepository repo) => _repo = repo;

        public async Task<(CheckoutResult? result, string error)> CreateAsync(Guid userId, CreateCheckoutRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.CustomerName))
                return (null, "CustomerName is required.");
            if (req.Quantity <= 0)
                return (null, "Quantity must be at least 1.");

            var item = await _repo.GetItemByIdAsync(req.ItemId);
            if (item == null) return (null, "The requested item is no longer available.");
            if (item.Stock < req.Quantity) return (null, $"Insufficient stock. Available: {item.Stock}.");

            var stockOk = await _repo.AdjustStockAsync(req.ItemId, -req.Quantity);
            if (!stockOk) return (null, "Stock deduction failed. Please try again.");

            var totalAmount = item.Price * req.Quantity;
            var currency = string.IsNullOrWhiteSpace(item.Currency) ? "VND" : item.Currency;

            var (orderId, orderNo) = await _repo.CreateCheckoutOrderAsync(userId, req, item.Price);
            var paymentId = await _repo.CreateCheckoutPaymentAsync(userId, totalAmount, currency);

            return (new CheckoutResult
            {
                CheckoutId = orderId,
                OrderNo = orderNo,
                TotalAmount = totalAmount,
                Currency = currency,
                OrderStatus = "PENDING",
                PaymentStatus = "PENDING"
            }, string.Empty);
        }

        public async Task<(CheckoutResult? result, string error)> PayAsync(Guid orderId, Guid userId, PayCheckoutRequest req)
        {
            // Load the order to get amount + currency
            var order = await _repo.GetOrderByIdAsync(orderId);
            if (order == null) return (null, "Checkout session not found. Please start a new order.");
            if (order.Status != "PENDING") return (null, "This order has already been processed and cannot be paid again.");

            // Card format validation (mock — no real Luhn needed)
            var cardNum = (req.CardNumber ?? "").Replace(" ", "").Replace("-", "");
            if (!Regex.IsMatch(cardNum, @"^\d{13,19}$"))
                return (null, "Card number must be 13–19 digits.");

            var expiry = (req.Expiry ?? "").Trim();
            if (!Regex.IsMatch(expiry, @"^\d{2}/\d{2}$"))
                return (null, "Expiry must be MM/YY format.");

            var parts = expiry.Split('/');
            if (!int.TryParse(parts[0], out int month) || month < 1 || month > 12)
                return (null, "Invalid expiry month (01–12).");
            if (!int.TryParse(parts[1], out int year))
                return (null, "Invalid expiry year.");
            var expiryDate = new DateTime(2000 + year, month, 1).AddMonths(1).AddDays(-1);
            if (expiryDate < DateTime.UtcNow.Date)
                return (null, "Card has expired.");

            if (!Regex.IsMatch((req.Cvv ?? "").Trim(), @"^\d{3,4}$"))
                return (null, "CVV must be 3 or 4 digits.");

            // Create payment record and confirm
            var totalAmount = order.UnitPrice * order.Quantity;
            var currency = string.IsNullOrWhiteSpace(order.ItemTitle) ? "VND" : "VND"; // currency not on order, default VND
            var paymentId = await _repo.CreateCheckoutPaymentAsync(userId, totalAmount, "VND");

            await _repo.SetPaymentSuccessAsync(paymentId);
            await _repo.SetOrderProcessingAsync(orderId, paymentId);

            return (new CheckoutResult
            {
                CheckoutId = orderId,
                OrderNo = order.OrderNo,
                TotalAmount = totalAmount,
                Currency = "VND",
                OrderStatus = "PROCESSING",
                PaymentStatus = "SUCCESS",
                CardLast4 = cardNum[^4..]
            }, string.Empty);
        }
    }
}
