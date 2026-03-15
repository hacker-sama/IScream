// =============================================================================
// SqlAppRepository — Recipes
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
        private static Recipe MapRecipe(SqlDataReader r) => new()
        {
            Id = ReadGuid(r, "Id"),
            FlavorName = r["FlavorName"].ToString()!,
            ShortDescription = ReadNullString(r, "ShortDescription"),
            Ingredients = ReadNullString(r, "Ingredients"),
            Procedure = ReadNullString(r, "Procedure"),
            ImageUrl = ReadNullString(r, "ImageUrl"),
            IsActive = ReadBool(r, "IsActive"),
            CreatedAt = ReadDateTime(r, "CreatedAt"),
            UpdatedAt = ReadDateTime(r, "UpdatedAt")
        };

        // -----------------------------------------------------------------
        // Queries
        // -----------------------------------------------------------------
        public Task<List<Recipe>> ListRecipesAsync(bool? isActive, string? search, int page, int pageSize)
        {
            var whereParts = new List<string>();
            if (isActive.HasValue) whereParts.Add("IsActive = @IsActive");
            if (!string.IsNullOrWhiteSpace(search)) whereParts.Add("FlavorName LIKE @Search");

            var where = whereParts.Count > 0
                ? $"WHERE {string.Join(" AND ", whereParts)}"
                : string.Empty;

            var parms = new List<SqlParameter>
            {
                P("@Skip", (page - 1) * pageSize),
                P("@Take", pageSize)
            };
            if (isActive.HasValue) parms.Add(P("@IsActive", isActive.Value));
            if (!string.IsNullOrWhiteSpace(search)) parms.Add(P("@Search", $"%{search.Trim()}%"));

            return QueryAsync($"""
                SELECT * FROM public_data.RECIPES {where}
                ORDER BY CreatedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY
                """, parms.ToArray(), MapRecipe);
        }

        public async Task<int> CountRecipesAsync(bool? isActive, string? search)
        {
            var whereParts = new List<string>();
            if (isActive.HasValue) whereParts.Add("IsActive = @IsActive");
            if (!string.IsNullOrWhiteSpace(search)) whereParts.Add("FlavorName LIKE @Search");

            var where = whereParts.Count > 0
                ? $"WHERE {string.Join(" AND ", whereParts)}"
                : string.Empty;

            var parms = new List<SqlParameter>();
            if (isActive.HasValue) parms.Add(P("@IsActive", isActive.Value));
            if (!string.IsNullOrWhiteSpace(search)) parms.Add(P("@Search", $"%{search.Trim()}%"));

            return await ExecuteScalarAsync<int?>($"SELECT COUNT(1) FROM public_data.RECIPES {where}", parms.ToArray()) ?? 0;
        }

        public Task<Recipe?> GetRecipeByIdAsync(Guid id)
            => QueryFirstAsync(
                "SELECT * FROM public_data.RECIPES WHERE Id = @Id",
                [P("@Id", id)], MapRecipe);

        public async Task<HashSet<Guid>> GetTopNActiveRecipeIdsAsync(int n)
        {
            var ids = await QueryAsync(
                "SELECT TOP (@N) Id FROM public_data.RECIPES WHERE IsActive = 1 ORDER BY CreatedAt DESC",
                [P("@N", n)], r => ReadGuid(r, "Id"));
            return new HashSet<Guid>(ids);
        }

        public async Task<Guid> CreateRecipeAsync(Recipe recipe)
        {
            var newId = Guid.NewGuid();
            await ExecuteAsync("""
                INSERT INTO public_data.RECIPES
                    (Id, FlavorName, ShortDescription, Ingredients, [Procedure], ImageUrl, IsActive)
                VALUES (@Id, @FlavorName, @ShortDescription, @Ingredients, @Procedure, @ImageUrl, 1)
                """,
                [P("@Id", newId), P("@FlavorName", recipe.FlavorName),
                 P("@ShortDescription", recipe.ShortDescription), P("@Ingredients", recipe.Ingredients),
                 P("@Procedure", recipe.Procedure), P("@ImageUrl", recipe.ImageUrl)]);
            return newId;
        }

        public async Task<bool> UpdateRecipeAsync(Recipe recipe)
        {
            var rows = await ExecuteAsync("""
                UPDATE public_data.RECIPES
                SET FlavorName = @FlavorName, ShortDescription = @ShortDescription,
                    Ingredients = @Ingredients, [Procedure] = @Procedure,
                    ImageUrl = @ImageUrl, IsActive = @IsActive
                WHERE Id = @Id
                """,
                [P("@Id", recipe.Id), P("@FlavorName", recipe.FlavorName),
                 P("@ShortDescription", recipe.ShortDescription), P("@Ingredients", recipe.Ingredients),
                 P("@Procedure", recipe.Procedure), P("@ImageUrl", recipe.ImageUrl),
                 P("@IsActive", recipe.IsActive)]);
            return rows > 0;
        }

        public async Task<bool> DeleteRecipeAsync(Guid id)
        {
            var rows = await ExecuteAsync(
                "UPDATE public_data.RECIPES SET IsActive = 0 WHERE Id = @Id",
                [P("@Id", id)]);
            return rows > 0;
        }
    }
}
