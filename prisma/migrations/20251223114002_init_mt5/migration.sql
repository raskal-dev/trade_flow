-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
    "experienceLevel" TEXT,
    "preferences" JSONB,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mt5_account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "encryptedPassword" TEXT NOT NULL,
    "server" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "syncFrequency" INTEGER NOT NULL DEFAULT 5,
    "lastSync" TIMESTAMP(3),
    "syncStatus" TEXT,
    "syncErrorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mt5_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade" (
    "id" TEXT NOT NULL,
    "mt5AccountId" TEXT NOT NULL,
    "ticket" BIGINT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "volume" DECIMAL(10,2) NOT NULL,
    "priceOpen" DECIMAL(20,5) NOT NULL,
    "priceClose" DECIMAL(20,5),
    "timeOpen" TIMESTAMP(3) NOT NULL,
    "timeClose" TIMESTAMP(3),
    "sl" DECIMAL(20,5),
    "tp" DECIMAL(20,5),
    "profit" DECIMAL(15,2),
    "commission" DECIMAL(15,2),
    "swap" DECIMAL(15,2),
    "comment" TEXT,
    "magicNumber" INTEGER,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "fieldConfig" JSONB,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "showInTable" BOOLEAN NOT NULL DEFAULT true,
    "showInStats" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_value" (
    "id" TEXT NOT NULL,
    "tradeId" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_field_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_log" (
    "id" TEXT NOT NULL,
    "mt5AccountId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "tradesSynced" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "mt5_account_userId_idx" ON "mt5_account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mt5_account_userId_accountNumber_server_key" ON "mt5_account"("userId", "accountNumber", "server");

-- CreateIndex
CREATE INDEX "trade_mt5AccountId_idx" ON "trade"("mt5AccountId");

-- CreateIndex
CREATE INDEX "trade_timeOpen_idx" ON "trade"("timeOpen");

-- CreateIndex
CREATE INDEX "trade_symbol_idx" ON "trade"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "trade_mt5AccountId_ticket_key" ON "trade"("mt5AccountId", "ticket");

-- CreateIndex
CREATE INDEX "custom_field_userId_idx" ON "custom_field"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_field_userId_fieldName_key" ON "custom_field"("userId", "fieldName");

-- CreateIndex
CREATE INDEX "custom_field_value_tradeId_idx" ON "custom_field_value"("tradeId");

-- CreateIndex
CREATE INDEX "custom_field_value_customFieldId_idx" ON "custom_field_value"("customFieldId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_field_value_tradeId_customFieldId_key" ON "custom_field_value"("tradeId", "customFieldId");

-- CreateIndex
CREATE INDEX "sync_log_mt5AccountId_idx" ON "sync_log"("mt5AccountId");

-- CreateIndex
CREATE INDEX "sync_log_createdAt_idx" ON "sync_log"("createdAt");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mt5_account" ADD CONSTRAINT "mt5_account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade" ADD CONSTRAINT "trade_mt5AccountId_fkey" FOREIGN KEY ("mt5AccountId") REFERENCES "mt5_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field" ADD CONSTRAINT "custom_field_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_value" ADD CONSTRAINT "custom_field_value_tradeId_fkey" FOREIGN KEY ("tradeId") REFERENCES "trade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_field_value" ADD CONSTRAINT "custom_field_value_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "custom_field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_log" ADD CONSTRAINT "sync_log_mt5AccountId_fkey" FOREIGN KEY ("mt5AccountId") REFERENCES "mt5_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
