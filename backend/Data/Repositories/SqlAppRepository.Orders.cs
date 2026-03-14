// =============================================================================
// SqlAppRepository — Orders
// =============================================================================
#nullable enable

using IScream.Models;
using Microsoft.Data.SqlClient;

namespace IScream.Data
{
    public partial class SqlAppRepository
    {
        // -----------------------------------------------------------------
        // Row Mapper
        // -----------------------------------------------------------------
        private static ItemOrder MapOrder(SqlDataReader r) => new()
        {
            Id = ReadGuid(r, "Id"),
            OrderNo = r["OrderNo"].ToString()!,
            CustomerName = r["CustomerName"].ToString()!,
            Email = ReadNullString(r, "Email"),
            Phone = ReadNullString(r, "Phone"),
            Address = ReadNullString(r, "Address"),
            ItemId = ReadGuid(r, "ItemId"),
            Quantity = ReadInt(r, "Quantity"),
            UnitPrice = ReadDecimal(r, "UnitPrice"),
            TotalCost = ReadDecimal(r, "TotalCost"),
            PaymentId = ReadNullGuid(r, "PaymentId"),
            Status = r["Status"].ToString()!,
            CreatedAt = ReadDateTime(r, "CreatedAt"),
            UpdatedAt = ReadDateTime(r, "UpdatedAt"),
            ItemTitle = ReadNullString(r, "ItemTitle"),
            ItemImageUrl = ReadNullString(r, "ItemImageUrl")
        };

        // -----------------------------------------------------------------
        // Queries
        // -----------------------------------------------------------------
        public async Task<Guid> CreateItemOrderAsync(ItemOrder order)
        {
            var newId = Guid.NewGuid();
            await ExecuteAsync("""
                INSERT INTO public_data.ITEM_ORDERS
                    (Id, OrderNo, CustomerName, Email, Phone, Address,
                     ItemId, Quantity, UnitPrice, PaymentId, Status)
                VALUES (@Id, @OrderNo, @CustomerName, @Email, @Phone, @Address,
                        @ItemId, @Quantity, @UnitPrice, @PaymentId, @Status)
                """,
                [P("@Id", newId), P("@OrderNo", order.OrderNo), P("@CustomerName", order.CustomerName),
                 P("@Email", order.Email), P("@Phone", order.Phone), P("@Address", order.Address),
                 P("@ItemId", order.ItemId), P("@Quantity", order.Quantity), P("@UnitPrice", order.UnitPrice),
                 P("@PaymentId", order.PaymentId), P("@Status", order.Status)]);
            return newId;
        }

        public Task<ItemOrder?> GetOrderByIdAsync(Guid id)
            => QueryFirstAsync("""
                SELECT o.*, i.Title AS ItemTitle, i.ImageUrl AS ItemImageUrl
                FROM public_data.ITEM_ORDERS o
                JOIN public_data.ITEMS i ON i.Id = o.ItemId
                WHERE o.Id = @Id
                """,
                [P("@Id", id)], MapOrder);

        public Task<ItemOrder?> GetOrderByNoAndEmailAsync(string orderNo, string email)
            => QueryFirstAsync("""
                SELECT o.*, i.Title AS ItemTitle, i.ImageUrl AS ItemImageUrl
                FROM public_data.ITEM_ORDERS o
                JOIN public_data.ITEMS i ON i.Id = o.ItemId
                WHERE o.OrderNo = @OrderNo AND o.Email = @Email
                """,
                [P("@OrderNo", orderNo), P("@Email", email)], MapOrder);

        public Task<List<ItemOrder>> ListOrdersAsync(string? status, int page, int pageSize, DateTime? startDate = null, DateTime? endDate = null)
        {
            var filters = new List<string>();
            var parms = new List<SqlParameter> { P("@Skip", (page - 1) * pageSize), P("@Take", pageSize) };

            if (!string.IsNullOrEmpty(status))
            {
                filters.Add("o.Status = @Status");
                parms.Add(P("@Status", status));
            }
            if (startDate.HasValue)
            {
                filters.Add("o.CreatedAt >= @StartDate");
                parms.Add(P("@StartDate", startDate.Value));
            }
            if (endDate.HasValue)
            {
                filters.Add("o.CreatedAt <= @EndDate");
                parms.Add(P("@EndDate", endDate.Value));
            }

            var where = filters.Count > 0 ? "WHERE " + string.Join(" AND ", filters) : "";

            return QueryAsync($"""
                SELECT o.*, i.Title AS ItemTitle, i.ImageUrl AS ItemImageUrl
                FROM public_data.ITEM_ORDERS o
                JOIN public_data.ITEMS i ON i.Id = o.ItemId {where}
                ORDER BY o.CreatedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY
                """, parms.ToArray(), MapOrder);
        }

        public Task<List<ItemOrder>> ListOrdersByEmailAsync(string email)
            => QueryAsync("""
                SELECT o.*, i.Title AS ItemTitle, i.ImageUrl AS ItemImageUrl
                FROM public_data.ITEM_ORDERS o
                JOIN public_data.ITEMS i ON i.Id = o.ItemId
                WHERE o.Email = @Email
                ORDER BY o.CreatedAt DESC
                """,
                [P("@Email", email)], MapOrder);

        public async Task<int> CountOrdersAsync(string? status, DateTime? startDate = null, DateTime? endDate = null)
        {
            var filters = new List<string>();
            var parms = new List<SqlParameter>();

            if (!string.IsNullOrEmpty(status))
            {
                filters.Add("Status = @Status");
                parms.Add(P("@Status", status));
            }
            if (startDate.HasValue)
            {
                filters.Add("CreatedAt >= @StartDate");
                parms.Add(P("@StartDate", startDate.Value));
            }
            if (endDate.HasValue)
            {
                filters.Add("CreatedAt <= @EndDate");
                parms.Add(P("@EndDate", endDate.Value));
            }

            var where = filters.Count > 0 ? "WHERE " + string.Join(" AND ", filters) : "";
            var parmArray = parms.Count > 0 ? parms.ToArray() : null;

            return await ExecuteScalarAsync<int?>($"SELECT COUNT(1) FROM public_data.ITEM_ORDERS {where}", parmArray) ?? 0;
        }

        public async Task<bool> UpdateOrderStatusAsync(Guid id, string status, Guid? paymentId = null)
        {
            int rows;
            if (paymentId.HasValue)
            {
                rows = await ExecuteAsync("""
                    UPDATE public_data.ITEM_ORDERS
                    SET Status = @Status, PaymentId = @PaymentId
                    WHERE Id = @Id
                    """,
                    [P("@Id", id), P("@Status", status), P("@PaymentId", paymentId.Value)]);
            }
            else
            {
                rows = await ExecuteAsync(
                    "UPDATE public_data.ITEM_ORDERS SET Status = @Status WHERE Id = @Id",
                    [P("@Id", id), P("@Status", status)]);
            }
            return rows > 0;
        }

        public async Task<bool> OrderNoExistsAsync(string orderNo)
        {
            var count = await ExecuteScalarAsync<int>(
                "SELECT COUNT(1) FROM public_data.ITEM_ORDERS WHERE OrderNo = @OrderNo",
                [P("@OrderNo", orderNo)]);
            return count > 0;
        }
    }
}
