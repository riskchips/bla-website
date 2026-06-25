-- Create contacts table
CREATE TABLE contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    details TEXT NOT NULL,
    unix_timestamp BIGINT NOT NULL
);

-- Create event_categories table
CREATE TABLE event_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Create events table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    gallery JSON DEFAULT ('[]'),
    poster_image TEXT,
    category_id BIGINT REFERENCES event_categories(id) ON DELETE SET NULL
);

-- Create help_requests table
CREATE TABLE help_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    date TEXT NOT NULL,
    buttons JSON DEFAULT ('[]'),
    unix_timestamp BIGINT NOT NULL
);

-- Create team table
CREATE TABLE team (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    image TEXT,
    board_year TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create about_content table
CREATE TABLE about_content (
  id integer PRIMARY KEY DEFAULT 1,
  content text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create word_of_the_day table
CREATE TABLE word_of_the_day (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date TEXT, -- YYYY-MM-DD or NULL for default words
    bn TEXT NOT NULL,
    en TEXT NOT NULL,
    pronunciation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create current_team table
CREATE TABLE current_team (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    image TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery table
CREATE TABLE gallery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
