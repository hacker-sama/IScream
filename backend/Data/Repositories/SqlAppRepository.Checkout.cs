// =============================================================================
// SqlAppRepository — Checkout
// Wraps ITEM_ORDERS + PAYMENTS with correct constraint-safe status values:
//   ITEM_ORDERS.Status : PENDING | PROCESSING | COMPLETED | DELIVERED | CANCELLED
//   PAYMENTS.Status    : PENDING | SUCCESS | FAILED
// =============================================================================
#nullable enable

using IScream.Models;
using Microsoft.Data.SqlClient;

namespace IScream.Data
{
    public partial class SqlAppRepository
    {
        public async Task<(Guid orderId, string orderNo)> CreateCheckoutOrderAsync(
            Guid? userId, CreateCheckoutRequest req, decimal unitPrice)
        {
            var newId = Guid.NewGuid();
            // Generate unique OrderNo
            string orderNo;
            int attempt = 0;
            do
            {
                var rand = new Random();
                orderNo = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{rand.Next(100000, 999999)}";
                attempt++;
                if (attempt > 10) throw new Exception("Unable to generate unique OrderNo.");
            } while (await OrderNoExistsAsync(orderNo));

            await ExecuteAsync("""
                INSERT INTO public_data.ITEM_ORDERS
                    (Id, OrderNo, CustomerName, Email, Phone, Address, ItemId, Quantity, UnitPrice, Status)
                VALUES (@Id, @OrderNo, @CustomerName, @Email, @Phone, @Address, @ItemId, @Quantity, @UnitPrice, 'PENDING')
                """,
                [P("@Id", newId), P("@OrderNo", orderNo), P("@CustomerName", req.CustomerName),
                 P("@Email", req.Email), P("@Phone", req.Phone), P("@Address", req.Address),
                 P("@ItemId", req.ItemId), P("@Quantity", req.Quantity), P("@UnitPrice", unitPrice)]);

            return (newId, orderNo);
        }

        public async Task<Guid> CreateCheckoutPaymentAsync(Guid? userId, decimal amount, string currency)
        {
            var newId = Guid.NewGuid();
            await ExecuteAsync("""
                INSERT INTO public_data.PAYMENTS (Id, UserId, Amount, Currency, Type, Status, CreatedAt)
                VALUES (@Id, @UserId, @Amount, @Currency, 'BOOK', 'PENDING', @CreatedAt)
                """,
                [P("@Id", newId), P("@UserId", userId), P("@Amount", amount),
                 P("@Currency", currency), P("@CreatedAt", DateTime.UtcNow)]);
            return newId;
        }

        public async Task<bool> SetOrderProcessingAsync(Guid orderId, Guid paymentId)
        {
            var rows = await ExecuteAsync("""
                UPDATE public_data.ITEM_ORDERS
                SET Status = 'PROCESSING', PaymentId = @PaymentId
                WHERE Id = @Id AND Status = 'PENDING'
                """,
                [P("@Id", orderId), P("@PaymentId", paymentId)]);
            return rows > 0;
        }

        public async Task<bool> SetPaymentSuccessAsync(Guid paymentId)
        {
            var rows = await ExecuteAsync(
                "UPDATE public_data.PAYMENTS SET Status = 'SUCCESS' WHERE Id = @Id AND Status = 'PENDING'",
                [P("@Id", paymentId)]);
            return rows > 0;
        }

        public async Task<bool> SetPaymentFailedAsync(Guid paymentId)
        {
            var rows = await ExecuteAsync(
                "UPDATE public_data.PAYMENTS SET Status = 'FAILED' WHERE Id = @Id AND Status = 'PENDING'",
                [P("@Id", paymentId)]);
            return rows > 0;
        }
    }
}
