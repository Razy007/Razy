# 📊 Pi Academy - Database Schema Documentation

## Overview

This document describes the **production database schema** for Pi Academy.  
Database: **PostgreSQL** (Hetzner VPS)

---

## 🔐 Table: `users`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key (internal) |
| `pi_id` | VARCHAR(100) | NO | - | **Pi Network UID** (unique identifier) |
| `username` | VARCHAR(100) | YES | NULL | Display name from Pi SDK |
| `avatar` | TEXT | YES | '👤' | Emoji or image URL |
| `level` | INTEGER | YES | 1 | Current level (1-100) |
| `xp` | INTEGER | YES | 0 | Current XP (resets per level) |
| `cumulated_xp` | INTEGER | YES | 0 | Total lifetime XP |
| `pi_balance` | DECIMAL(20,8) | YES | 0 | Educational Pi balance (non-liquid) |
| `mainnet_balance` | DECIMAL(20,8) | YES | 0 | Real Pi balance (withdrawable) |
| `transferable_balance` | DECIMAL(20,8) | YES | 0 | Transferable balance |
| `staking_balance` | DECIMAL(20,8) | YES | 0 | Pi currently staked |
| `energy_balance` | INTEGER | YES | 100 | Energy points (0-200) |
| `last_energy_update` | BIGINT | YES | NOW() | Timestamp for energy regen |
| `completed_layers` | JSONB | YES | '{}' | Map of completed layers |
| `inventory` | JSONB | YES | '[]' | Purchased items array |
| `referral_code` | VARCHAR(20) | YES | NULL | User's referral code |
| `referred_by` | VARCHAR(100) | YES | NULL | Pi ID of referrer |
| `credibility_score` | INTEGER | YES | 0 | Score for withdrawal unlock |
| `created_at` | TIMESTAMP | YES | NOW() | Account creation date |
| `updated_at` | TIMESTAMP | YES | NOW() | Last update date |

### Indexes
- `UNIQUE` on `pi_id`
- `INDEX` on `referral_code`

### Notes
- **No `role` column** in production (removed for simplicity)
- **No `kyc_status` column** (handled by Pi SDK directly)
- Backend `UserRepository.ts` is adapted to this schema

---

## 📝 Table: `social_posts`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key |
| `user_id` | INTEGER | NO | - | FK to users.id |
| `content` | TEXT | NO | - | Post content |
| `likes_count` | INTEGER | YES | 0 | Number of likes |
| `created_at` | TIMESTAMP | YES | NOW() | Post date |

### Notes
- **No `comments_count`** column (computed from `social_comments`)

---

## 💬 Table: `social_comments`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key |
| `post_id` | INTEGER | NO | - | FK to social_posts.id |
| `user_id` | INTEGER | NO | - | FK to users.id |
| `content` | TEXT | NO | - | Comment content |
| `parent_comment_id` | INTEGER | YES | NULL | For nested replies |
| `created_at` | TIMESTAMP | YES | NOW() | Comment date |

---

## 💰 Table: `transactions`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key |
| `user_id` | INTEGER | NO | - | FK to users.id |
| `type` | VARCHAR(50) | NO | - | `reward`, `purchase`, `staking`, etc. |
| `amount` | DECIMAL(20,8) | NO | - | Transaction amount |
| `description` | TEXT | YES | NULL | Human-readable description |
| `created_at` | TIMESTAMP | YES | NOW() | Transaction date |

---

## 🔒 Table: `stakes`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key |
| `user_id` | INTEGER | NO | - | FK to users.id |
| `amount` | DECIMAL(20,8) | NO | - | Staked amount |
| `lock_days` | INTEGER | NO | - | Lock period (7/30/90/365) |
| `apy` | DECIMAL(5,2) | NO | - | Annual percentage yield |
| `started_at` | TIMESTAMP | YES | NOW() | Stake start date |
| `unlocks_at` | TIMESTAMP | NO | - | Unlock date |
| `claimed` | BOOLEAN | YES | false | Has been claimed |

---

## 💸 Table: `withdrawal_requests`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key |
| `user_id` | VARCHAR(100) | NO | - | Pi ID (string) |
| `amount` | DECIMAL(20,8) | NO | - | Requested amount |
| `wallet_address` | VARCHAR(100) | NO | - | Pi wallet public key |
| `status` | VARCHAR(20) | YES | 'pending' | `pending`, `approved`, `rejected` |
| `created_at` | TIMESTAMP | YES | NOW() | Request date |
| `processed_at` | TIMESTAMP | YES | NULL | Processing date |

---

## 👥 Table: `referrals`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key |
| `referrer_id` | VARCHAR(100) | NO | - | Pi ID of referrer |
| `referred_id` | VARCHAR(100) | NO | - | Pi ID of referred user |
| `referral_code` | VARCHAR(20) | NO | - | Code used |
| `status` | VARCHAR(20) | YES | 'active' | `active`, `inactive` |
| `created_at` | TIMESTAMP | YES | NOW() | Referral date |

---

## 📋 Table: `audit_logs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | SERIAL | NO | auto | Primary key |
| `user_id` | VARCHAR(100) | YES | NULL | Pi ID (optional) |
| `action` | VARCHAR(100) | NO | - | Action type |
| `details` | JSONB | YES | NULL | Additional context |
| `ip_address` | VARCHAR(50) | YES | NULL | Request IP |
| `created_at` | TIMESTAMP | YES | NOW() | Log date |

---

## 🔄 Migration Strategy

The production database was created incrementally. Key migrations:

1. `001_create_users_table.sql` - Core user table
2. `002_create_transactions_table.sql` - Financial tracking
3. `003_create_stakes_table.sql` - Staking logic
4. `004_create_social_tables.sql` - Social features
5. `005_create_audit_logs.sql` - Security logging
6. `006_create_referrals.sql` - Referral system

### Important Notes

- Development migrations may include columns that production doesn't have
- Always verify against production before writing new migrations
- Use `SELECT * FROM information_schema.columns WHERE table_name = 'users'` to inspect

---

## 📊 Useful Queries

```sql
-- Check user balance
SELECT pi_id, username, level, pi_balance, mainnet_balance FROM users WHERE pi_id = 'xxx';

-- Check staking positions
SELECT u.username, s.amount, s.apy, s.unlocks_at FROM stakes s JOIN users u ON s.user_id = u.id WHERE s.claimed = false;

-- Check withdrawal queue
SELECT * FROM withdrawal_requests WHERE status = 'pending' ORDER BY created_at;

-- Count active referrals
SELECT referrer_id, COUNT(*) as total FROM referrals WHERE status = 'active' GROUP BY referrer_id ORDER BY total DESC;
```

---

*Last Updated: 2026-01-21*
