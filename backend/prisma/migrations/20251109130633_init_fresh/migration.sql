-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL DEFAULT 'SELLER',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "brands" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "models" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "models_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_fcfa" BIGINT NOT NULL,
    "state" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "gearbox" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage_km" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "doors" INTEGER,
    "power_cv" INTEGER,
    "chassis_number" TEXT,
    "brand_id" INTEGER NOT NULL,
    "model_id" INTEGER,
    "category_id" INTEGER NOT NULL,
    "location_country" TEXT NOT NULL DEFAULT 'Côte d''Ivoire',
    "location_city" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "rejection_reason" TEXT,
    "is_sponsored" BOOLEAN NOT NULL DEFAULT false,
    "sponsored_until" DATETIME,
    "sponsored_priority" INTEGER NOT NULL DEFAULT 0,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "listings_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "listings_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "listings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "listing_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "listing_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "listing_images_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "threads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listing_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "threads_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "threads_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "threads_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "thread_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "boost_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration_days" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "price_fcfa" BIGINT NOT NULL,
    "credits_cost" BIGINT NOT NULL DEFAULT 0,
    "effect" TEXT NOT NULL DEFAULT 'TOP',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "features" JSONB
);

-- CreateTable
CREATE TABLE "boosts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listing_id" TEXT NOT NULL,
    "boost_product_id" INTEGER NOT NULL,
    "buyer_id" TEXT,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "payment_amount" BIGINT NOT NULL DEFAULT 0,
    "payment_provider" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "boosts_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "boosts_boost_product_id_fkey" FOREIGN KEY ("boost_product_id") REFERENCES "boost_products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "boosts_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "balance_credits" BIGINT NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wallet_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "reason" TEXT,
    "related_entity_type" TEXT,
    "related_entity_id" TEXT,
    "actor_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "wallet_transactions_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "admin_note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reports_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "listings" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "meta" JSONB,
    "ip" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "models_brand_id_name_key" ON "models"("brand_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "listings_status_idx" ON "listings"("status");

-- CreateIndex
CREATE INDEX "listings_is_sponsored_idx" ON "listings"("is_sponsored");

-- CreateIndex
CREATE INDEX "listings_created_at_idx" ON "listings"("created_at");

-- CreateIndex
CREATE INDEX "listings_price_fcfa_idx" ON "listings"("price_fcfa");

-- CreateIndex
CREATE INDEX "listings_brand_id_idx" ON "listings"("brand_id");

-- CreateIndex
CREATE INDEX "listings_category_id_idx" ON "listings"("category_id");

-- CreateIndex
CREATE INDEX "listings_location_city_idx" ON "listings"("location_city");

-- CreateIndex
CREATE UNIQUE INDEX "threads_listing_id_buyer_id_key" ON "threads"("listing_id", "buyer_id");

-- CreateIndex
CREATE INDEX "messages_thread_id_idx" ON "messages"("thread_id");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

-- CreateIndex
CREATE INDEX "boosts_listing_id_idx" ON "boosts"("listing_id");

-- CreateIndex
CREATE INDEX "boosts_ends_at_idx" ON "boosts"("ends_at");

-- CreateIndex
CREATE INDEX "boosts_buyer_id_idx" ON "boosts"("buyer_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallet_transactions_wallet_id_idx" ON "wallet_transactions"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_transactions_created_at_idx" ON "wallet_transactions"("created_at");

-- CreateIndex
CREATE INDEX "wallet_transactions_actor_id_idx" ON "wallet_transactions"("actor_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_listing_id_key" ON "favorites"("user_id", "listing_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
