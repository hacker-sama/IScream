// =============================================================================
// CheckoutFunctions — Unified shop checkout API
// POST /api/checkout         — Step 1: place order (requires auth)
// POST /api/checkout/{id}/pay — Step 2: pay with card (requires auth)
// =============================================================================
#nullable enable

using IScream.Models;
using IScream.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Logging;
using System.Net;

namespace IScream.Functions
{
    public class CheckoutFunctions
    {
        private readonly ICheckoutService _svc;
        private readonly ILogger<CheckoutFunctions> _log;

        public CheckoutFunctions(ICheckoutService svc, ILogger<CheckoutFunctions> log)
        {
            _svc = svc;
            _log = log;
        }

        [Function("Checkout_Create")]
        [OpenApiOperation(operationId: "Checkout_Create", tags: new[] { "Checkout" }, Summary = "Start checkout", Description = "Creates an order record. Returns checkoutId to use in the pay step.")]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(CreateCheckoutRequest), Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.Created, contentType: "application/json", bodyType: typeof(ApiResponse<CheckoutResult>))]
        [OpenApiSecurity("bearer_auth", SecuritySchemeType.Http, Scheme = OpenApiSecuritySchemeType.Bearer, BearerFormat = "JWT")]
        public async Task<HttpResponseData> Create(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "checkout")] HttpRequestData req)
        {
            try
            {
                var claims = FunctionHelper.ExtractAuthClaims(req);
                if (claims == null) return await FunctionHelper.Unauthorized(req);

                var body = await req.ReadFromJsonAsync<CreateCheckoutRequest>();
                if (body == null) return await FunctionHelper.BadRequest(req, "Invalid request body.");

                var (result, error) = await _svc.CreateAsync(claims.Value.userId, body);
                if (result == null) return await FunctionHelper.BadRequest(req, error);

                return await FunctionHelper.Created(req, result, "Checkout created.");
            }
            catch (Exception ex) { return await FunctionHelper.ServerError(req, ex, _log, nameof(Create)); }
        }

        [Function("Checkout_Pay")]
        [OpenApiOperation(operationId: "Checkout_Pay", tags: new[] { "Checkout" }, Summary = "Pay checkout", Description = "Submits card details to complete payment. Order moves to PROCESSING, payment to SUCCESS.")]
        [OpenApiParameter(name: "id", In = ParameterLocation.Path, Required = true, Type = typeof(Guid))]
        [OpenApiRequestBody(contentType: "application/json", bodyType: typeof(PayCheckoutRequest), Required = true)]
        [OpenApiResponseWithBody(statusCode: HttpStatusCode.OK, contentType: "application/json", bodyType: typeof(ApiResponse<CheckoutResult>))]
        [OpenApiSecurity("bearer_auth", SecuritySchemeType.Http, Scheme = OpenApiSecuritySchemeType.Bearer, BearerFormat = "JWT")]
        public async Task<HttpResponseData> Pay(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "checkout/{id:guid}/pay")] HttpRequestData req,
            Guid id)
        {
            try
            {
                var claims = FunctionHelper.ExtractAuthClaims(req);
                if (claims == null) return await FunctionHelper.Unauthorized(req);

                var body = await req.ReadFromJsonAsync<PayCheckoutRequest>();
                if (body == null) return await FunctionHelper.BadRequest(req, "Invalid request body.");

                var (result, error) = await _svc.PayAsync(id, claims.Value.userId, body);
                if (result == null) return await FunctionHelper.BadRequest(req, error);

                return await FunctionHelper.Ok(req, result, "Payment successful.");
            }
            catch (Exception ex) { return await FunctionHelper.ServerError(req, ex, _log, nameof(Pay)); }
        }
    }
}
