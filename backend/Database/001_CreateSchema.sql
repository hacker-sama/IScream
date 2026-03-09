-- =============================================================================
-- IScream — Database Setup Script
-- Creates the public_data schema and all required tables.
--
-- Run against SQL Server (LocalDB, Developer, or Azure SQL):
--   sqlcmd -S "(localdb)\mssqllocaldb" -d IceCreamRecipeDB -i 001_CreateSchema.sql
-- =============================================================================

-- Create the schema
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'public_data')
    EXEC('CREATE SCHEMA public_data');
GO

-- =============================================================================
-- USERS
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.USERS'))
BEGIN
    CREATE TABLE public_data.USERS (
        Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        Username     NVARCHAR(100)    NOT NULL,
        Email        NVARCHAR(200)    NULL,
        PasswordHash NVARCHAR(500)    NOT NULL,
        FullName     NVARCHAR(200)    NULL,
        Role         NVARCHAR(20)     NOT NULL DEFAULT 'MEMBER',  -- MEMBER | ADMIN
        IsActive     BIT              NOT NULL DEFAULT 1,
        CreatedAt    DATETIME2        NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT UQ_USERS_Username UNIQUE (Username)
    );
    CREATE UNIQUE INDEX IX_USERS_Email ON public_data.USERS (Email) WHERE Email IS NOT NULL;
END
GO

-- =============================================================================
-- ITEMS  (merchandise / books for sale)
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.ITEMS'))
BEGIN
    CREATE TABLE public_data.ITEMS (
        Id          UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        Title       NVARCHAR(200)    NOT NULL,
        Description NVARCHAR(MAX)    NULL,
        Price       DECIMAL(18, 2)   NOT NULL,
        Currency    NVARCHAR(10)     NOT NULL DEFAULT 'VND',
        ImageUrl    NVARCHAR(500)    NULL,
        Stock       INT              NOT NULL DEFAULT 0,
        IsActive    BIT              NOT NULL DEFAULT 1,
        CreatedAt   DATETIME2        NOT NULL DEFAULT SYSDATETIME(),
        UpdatedAt   DATETIME2        NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

-- =============================================================================
-- PAYMENTS  (MEMBERSHIP | ORDER)
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.PAYMENTS'))
BEGIN
    CREATE TABLE public_data.PAYMENTS (
        Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        UserId    UNIQUEIDENTIFIER NULL REFERENCES public_data.USERS(Id),
        Amount    DECIMAL(18, 2)   NOT NULL,
        Currency  NVARCHAR(10)     NOT NULL DEFAULT 'VND',
        Type      NVARCHAR(20)     NOT NULL,   -- MEMBERSHIP | ORDER
        Status    NVARCHAR(20)     NOT NULL DEFAULT 'PENDING',  -- PENDING | SUCCESS | FAILED
        MetaJson  NVARCHAR(MAX)    NULL,
        CreatedAt DATETIME2        NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

-- =============================================================================
-- ITEM_ORDERS  (e-commerce orders)
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.ITEM_ORDERS'))
BEGIN
    CREATE TABLE public_data.ITEM_ORDERS (
        Id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        OrderNo      NVARCHAR(50)     NOT NULL,
        CustomerName NVARCHAR(200)    NOT NULL,
        Email        NVARCHAR(200)    NULL,
        Phone        NVARCHAR(30)     NULL,
        Address      NVARCHAR(500)    NULL,
        ItemId       UNIQUEIDENTIFIER NOT NULL REFERENCES public_data.ITEMS(Id),
        Quantity     INT              NOT NULL DEFAULT 1,
        UnitPrice    DECIMAL(18, 2)   NOT NULL,
        TotalCost    AS (Quantity * UnitPrice) PERSISTED,
        PaymentId    UNIQUEIDENTIFIER NULL REFERENCES public_data.PAYMENTS(Id),
        Status       NVARCHAR(20)     NOT NULL DEFAULT 'PENDING',  -- PENDING | PAID | SHIPPED | DELIVERED | CANCELLED
        CreatedAt    DATETIME2        NOT NULL DEFAULT SYSDATETIME(),
        UpdatedAt    DATETIME2        NOT NULL DEFAULT SYSDATETIME(),

        CONSTRAINT UQ_ITEM_ORDERS_OrderNo UNIQUE (OrderNo)
    );
END
GO

-- =============================================================================
-- MEMBERSHIP_PLANS
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.MEMBERSHIP_PLANS'))
BEGIN
    CREATE TABLE public_data.MEMBERSHIP_PLANS (
        Id           INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
        Code         NVARCHAR(50)  NOT NULL,
        Price        DECIMAL(18,2) NOT NULL,
        Currency     NVARCHAR(10)  NOT NULL DEFAULT 'VND',
        DurationDays INT           NOT NULL DEFAULT 30,
        IsActive     BIT           NOT NULL DEFAULT 1,

        CONSTRAINT UQ_MEMBERSHIP_PLANS_Code UNIQUE (Code)
    );
END
GO

-- =============================================================================
-- MEMBERSHIP_SUBSCRIPTIONS
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.MEMBERSHIP_SUBSCRIPTIONS'))
BEGIN
    CREATE TABLE public_data.MEMBERSHIP_SUBSCRIPTIONS (
        Id        UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        UserId    UNIQUEIDENTIFIER NOT NULL REFERENCES public_data.USERS(Id),
        PlanId    INT              NOT NULL REFERENCES public_data.MEMBERSHIP_PLANS(Id),
        PaymentId UNIQUEIDENTIFIER NULL REFERENCES public_data.PAYMENTS(Id),
        StartDate DATETIME2        NOT NULL,
        EndDate   DATETIME2        NOT NULL,
        Status    NVARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | EXPIRED | CANCELLED
        CreatedAt DATETIME2        NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

-- =============================================================================
-- RECIPES
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.RECIPES'))
BEGIN
    CREATE TABLE public_data.RECIPES (
        Id               UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        FlavorName       NVARCHAR(200)    NOT NULL,
        ShortDescription NVARCHAR(500)    NULL,
        Ingredients      NVARCHAR(MAX)    NULL,
        [Procedure]      NVARCHAR(MAX)    NULL,
        ImageUrl         NVARCHAR(500)    NULL,
        IsActive         BIT              NOT NULL DEFAULT 1,
        CreatedAt        DATETIME2        NOT NULL DEFAULT SYSDATETIME(),
        UpdatedAt        DATETIME2        NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

-- =============================================================================
-- RECIPE_SUBMISSIONS  (user-generated content)
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.RECIPE_SUBMISSIONS'))
BEGIN
    CREATE TABLE public_data.RECIPE_SUBMISSIONS (
        Id               UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        UserId           UNIQUEIDENTIFIER NULL REFERENCES public_data.USERS(Id),
        Name             NVARCHAR(200)    NULL,
        Email            NVARCHAR(200)    NULL,
        Title            NVARCHAR(200)    NOT NULL,
        Description      NVARCHAR(MAX)    NULL,
        Ingredients      NVARCHAR(MAX)    NULL,
        Steps            NVARCHAR(MAX)    NULL,
        ImageUrl         NVARCHAR(500)    NULL,
        Status           NVARCHAR(20)     NOT NULL DEFAULT 'PENDING',  -- PENDING | APPROVED | REJECTED
        PrizeMoney       DECIMAL(18,2)    NULL,
        CertificateUrl   NVARCHAR(500)    NULL,
        ReviewedByUserId UNIQUEIDENTIFIER NULL REFERENCES public_data.USERS(Id),
        ReviewNote       NVARCHAR(1000)   NULL,
        CreatedAt        DATETIME2        NOT NULL DEFAULT SYSDATETIME(),
        ReviewedAt       DATETIME2        NULL
    );
END
GO

-- =============================================================================
-- FEEDBACKS
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE object_id = OBJECT_ID('public_data.FEEDBACKS'))
BEGIN
    CREATE TABLE public_data.FEEDBACKS (
        Id               UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        UserId           UNIQUEIDENTIFIER NULL REFERENCES public_data.USERS(Id),
        Name             NVARCHAR(200)    NULL,
        Email            NVARCHAR(200)    NULL,
        Message          NVARCHAR(MAX)    NOT NULL,
        IsRegisteredUser BIT              NOT NULL DEFAULT 0,
        IsRead           BIT              NOT NULL DEFAULT 0,
        CreatedAt        DATETIME2        NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

-- =============================================================================
-- SEED: default membership plans
-- =============================================================================
IF NOT EXISTS (SELECT 1 FROM public_data.MEMBERSHIP_PLANS WHERE Code = 'MONTHLY')
    INSERT INTO public_data.MEMBERSHIP_PLANS (Code, Price, Currency, DurationDays, IsActive)
    VALUES ('MONTHLY', 99000, 'VND', 30, 1);

IF NOT EXISTS (SELECT 1 FROM public_data.MEMBERSHIP_PLANS WHERE Code = 'YEARLY')
    INSERT INTO public_data.MEMBERSHIP_PLANS (Code, Price, Currency, DurationDays, IsActive)
    VALUES ('YEARLY', 990000, 'VND', 365, 1);
GO

PRINT 'IScream schema created successfully.';
