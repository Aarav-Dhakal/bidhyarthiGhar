-- ============================================================
-- Bidhyarthi Ghar Database Schema
-- Run this file ONCE to set up all tables
-- ============================================================

-- Enable UUID extension (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------
-- USERS TABLE
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,           -- bcrypt hashed
    role            VARCHAR(20) NOT NULL DEFAULT 'student'
                        CHECK (role IN ('student', 'landlord', 'service_provider', 'admin')),
    phone           VARCHAR(20),
    avatar_url      TEXT,
    email_verified  BOOLEAN DEFAULT FALSE,
    phone_verified  BOOLEAN DEFAULT FALSE,
    college         VARCHAR(255),
    year            VARCHAR(50),
    budget          NUMERIC(10, 2),
    preferences     TEXT,                            -- Can store JSON or comma-separated list
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- -----------------------------------------------
-- ROOMS (Listings) TABLE
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS rooms (
    id              SERIAL PRIMARY KEY,
    landlord_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    price           NUMERIC(10, 2) NOT NULL,
    location        VARCHAR(255) NOT NULL,
    address         TEXT,
    room_type       VARCHAR(50) DEFAULT 'room'
                        CHECK (room_type IN ('single', 'shared', 'apartment', 'hostel', 'room', 'flat', 'hotel')),
    total_rooms     INTEGER DEFAULT 1,
    available_rooms INTEGER DEFAULT 1,
    amenities       TEXT[],                      -- array of strings e.g. '{wifi,parking,water}'
    image_urls      TEXT[],
    status          VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending', 'active', 'inactive')),
    is_available    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- -----------------------------------------------
-- BOOKINGS TABLE
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
    id          SERIAL PRIMARY KEY,
    room_id     INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    student_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      VARCHAR(30) DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    message     TEXT,
    move_in_date DATE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- -----------------------------------------------
-- MESSAGES TABLE
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id          SERIAL PRIMARY KEY,
    sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- -----------------------------------------------
-- REVIEWS TABLE
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id          SERIAL PRIMARY KEY,
    room_id     INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    student_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT NOW(),
    UNIQUE (room_id, student_id)                 -- one review per student per room
);

-- -----------------------------------------------
-- MARKETPLACE TABLE (items for sale/rent by students)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS marketplace_items (
    id          SERIAL PRIMARY KEY,
    seller_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    price       NUMERIC(10, 2),
    category    VARCHAR(100),
    condition   VARCHAR(50) DEFAULT 'used'
                    CHECK (condition IN ('new', 'like new', 'good', 'used', 'for parts', 'like_new', 'for_parts')),
    image_urls  TEXT[],
    is_sold     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- -----------------------------------------------
-- SEED DATA — Default Admin & Test Users
-- Passwords are bcrypt hashed (cost 10)
-- admin123 → $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- 12345    → $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- -----------------------------------------------
INSERT INTO users (name, email, password, role) VALUES
    ('Super Admin',  'admin@bg.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
    ('Aryan Thapa',  'aryan@bg.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
    ('Ram Landlord', 'owner@bg.com',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'landlord')
ON CONFLICT (email) DO NOTHING;

-- Sample rooms
INSERT INTO rooms (landlord_id, title, description, price, location, room_type, amenities) VALUES
    (3, 'Cozy Room in Koteshwor', 'Furnished room near bus stop. Wi-Fi and water included!', 5000, 'Koteshwor, Kathmandu', 'room', ARRAY['wifi', 'water', 'electricity']),
    (3, 'Shared Hostel Lazimpat',  'Cheap shared room for students. Near college.', 3000, 'Lazimpat, Kathmandu',  'shared',  ARRAY['wifi', 'laundry'])
ON CONFLICT DO NOTHING;

COMMIT;
