-- MySQL 8+ schema for the mobile-first baby naming platform.
-- Keep this file aligned with prisma/schema.prisma.

CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(190) NULL,
  credits_balance INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_phone (phone),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE baby_names (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  gender ENUM('BOY', 'GIRL', 'UNISEX') NOT NULL,
  origin VARCHAR(120) NULL,
  meaning TEXT NOT NULL,
  starting_letter CHAR(1) NOT NULL,
  numerology_number TINYINT UNSIGNED NULL,
  style_label VARCHAR(60) NULL,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  school VARCHAR(100) NULL,
  religion VARCHAR(80) NULL,
  name_length TINYINT UNSIGNED NOT NULL,
  pronunciation_score DECIMAL(4, 2) NULL,
  usability_score DECIMAL(4, 2) NULL,
  rarity_score DECIMAL(4, 2) NULL,
  search_count INT UNSIGNED NOT NULL DEFAULT 0,
  favorite_count INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_baby_names_slug (slug),
  KEY idx_baby_names_filters (gender, religion, starting_letter),
  KEY idx_baby_names_gender_numerology (gender, numerology_number),
  KEY idx_baby_names_premium_rarity (is_premium, rarity_score),
  KEY idx_baby_names_style (style_label),
  KEY idx_baby_names_popularity (search_count),
  FULLTEXT KEY ft_baby_names_name_meaning (name, meaning),
  CONSTRAINT chk_baby_names_numerology
    CHECK (numerology_number IS NULL OR numerology_number BETWEEN 1 AND 9),
  CONSTRAINT chk_baby_names_pronunciation_score
    CHECK (pronunciation_score IS NULL OR pronunciation_score BETWEEN 0 AND 100),
  CONSTRAINT chk_baby_names_usability_score
    CHECK (usability_score IS NULL OR usability_score BETWEEN 0 AND 100),
  CONSTRAINT chk_baby_names_rarity_score
    CHECK (rarity_score IS NULL OR rarity_score BETWEEN 0 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE searches (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  query VARCHAR(120) NULL,
  gender ENUM('BOY', 'GIRL', 'UNISEX') NULL,
  religion VARCHAR(80) NULL,
  starting_letter CHAR(1) NULL,
  numerology_number TINYINT UNSIGNED NULL,
  result_count INT UNSIGNED NOT NULL DEFAULT 0,
  filters JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_searches_created (created_at),
  KEY idx_searches_user_created (user_id, created_at),
  KEY idx_searches_query (query),
  KEY idx_searches_filters (gender, religion, starting_letter),
  CONSTRAINT fk_searches_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL,
  CONSTRAINT chk_searches_numerology
    CHECK (numerology_number IS NULL OR numerology_number BETWEEN 1 AND 9)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'razorpay',
  razorpay_order_id VARCHAR(100) NOT NULL,
  razorpay_payment_id VARCHAR(100) NULL,
  amount_paise INT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  status ENUM('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'CREATED',
  receipt VARCHAR(100) NULL,
  metadata JSON NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_razorpay_order_id (razorpay_order_id),
  UNIQUE KEY uq_payments_razorpay_payment_id (razorpay_payment_id),
  KEY idx_payments_user_status (user_id, status),
  KEY idx_payments_status_created (status, created_at),
  CONSTRAINT fk_payments_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE premium_unlocks (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  payment_id BIGINT UNSIGNED NULL,
  baby_name_id BIGINT UNSIGNED NULL,
  unlock_type ENUM('SINGLE_NAME', 'PREMIUM_PACK', 'FULL_ACCESS', 'CONSULTATION') NOT NULL,
  starts_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_premium_unlocks_user_access (user_id, is_active, expires_at),
  KEY idx_premium_unlocks_payment (payment_id),
  KEY idx_premium_unlocks_baby_name (baby_name_id),
  CONSTRAINT fk_premium_unlocks_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_premium_unlocks_payment
    FOREIGN KEY (payment_id) REFERENCES payments (id)
    ON DELETE SET NULL,
  CONSTRAINT fk_premium_unlocks_baby_name
    FOREIGN KEY (baby_name_id) REFERENCES baby_names (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE credit_transactions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  premium_unlock_id BIGINT UNSIGNED NULL,
  transaction_type ENUM('PURCHASE', 'UNLOCK', 'REFUND', 'ADJUSTMENT') NOT NULL,
  credits_delta INT NOT NULL,
  balance_after INT UNSIGNED NOT NULL,
  reason VARCHAR(160) NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_credit_transactions_user_created (user_id, created_at),
  KEY idx_credit_transactions_unlock (premium_unlock_id),
  CONSTRAINT fk_credit_transactions_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_credit_transactions_unlock
    FOREIGN KEY (premium_unlock_id) REFERENCES premium_unlocks (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE consultations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  phone VARCHAR(20) NOT NULL,
  parent_name VARCHAR(120) NULL,
  baby_gender ENUM('BOY', 'GIRL', 'UNISEX') NULL,
  preferred_language VARCHAR(60) NULL,
  requirements TEXT NULL,
  status ENUM('NEW', 'CONTACTED', 'CONVERTED', 'CLOSED') NOT NULL DEFAULT 'NEW',
  whatsapp_conversation_id VARCHAR(120) NULL,
  source VARCHAR(80) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consultations_phone (phone),
  KEY idx_consultations_status_created (status, created_at),
  KEY idx_consultations_user_created (user_id, created_at),
  CONSTRAINT fk_consultations_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
