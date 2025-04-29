-- Users Table
CREATE TABLE Users (
    id TEXT PRIMARY KEY, -- Unique identifier (e.g., UUID or from auth provider)
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK(role IN ("COMPANY", "INVESTOR", "ADMIN")), -- User role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Profiles Table
CREATE TABLE CompanyProfiles (
    user_id TEXT PRIMARY KEY,
    company_name TEXT,
    -- Financials
    revenue_last_12_months REAL,
    mrr REAL,
    arr REAL,
    yoy_growth_rate REAL,
    monthly_burn_rate REAL,
    cogs REAL,
    cac REAL,
    gross_margin_percent REAL,
    ebitda REAL,
    net_profit_loss REAL,
    current_cash_balance REAL,
    runway_months REAL,
    -- Funding & Valuation
    funding_amount_sought REAL,
    funding_type TEXT, -- Equity, SAFE, Convertible Note
    pre_money_valuation REAL,
    post_money_valuation REAL,
    use_of_funds TEXT,
    previous_rounds_details TEXT, -- JSON or Text blob for simplicity in MVP
    cap_table_overview TEXT, -- JSON or Text blob
    -- Traction & Growth
    active_users_or_customers INTEGER,
    user_growth_rate REAL,
    customer_retention_rate REAL,
    churn_rate REAL,
    ltv REAL,
    ltv_cac_ratio REAL,
    gmv REAL, -- If applicable
    conversion_rates TEXT, -- JSON or Text blob
    avg_order_value REAL, -- If applicable
    -- Market Data
    tam REAL,
    sam REAL,
    som REAL,
    competitive_positioning TEXT,
    -- Operational KPIs
    team_size INTEGER,
    team_breakdown TEXT, -- JSON or Text blob
    product_dev_details TEXT, -- JSON or Text blob
    sales_marketing_details TEXT, -- JSON or Text blob
    -- Other Profile Info
    website TEXT,
    location TEXT,
    industry TEXT,
    pitch_deck_url TEXT, -- Link to uploaded file (storage TBD)
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Investor Profiles Table
CREATE TABLE InvestorProfiles (
    user_id TEXT PRIMARY KEY,
    full_name TEXT,
    phone_number TEXT,
    linkedin_profile TEXT,
    investor_type TEXT, -- Angel, VC, Family Office, etc.
    accredited_investor BOOLEAN,
    company_fund_name TEXT,
    location_country TEXT,
    location_city TEXT,
    -- Investment Preferences
    investment_stages TEXT, -- Comma-separated or JSON array: Pre-Seed, Seed, Series A, etc.
    interested_industries TEXT, -- Comma-separated or JSON array: Fintech, Healthtech, etc.
    typical_investment_size TEXT, -- Range: <$25k, $25k-$100k, etc.
    investments_per_year TEXT, -- Range: 1-2, 3-5, etc.
    lead_investor_role TEXT, -- Yes, No, Depends
    preferred_engagement_method TEXT, -- Video call, Email, etc.
    -- Deal Preferences
    preferred_deal_structures TEXT, -- Comma-separated or JSON array: Equity, SAFE, etc.
    co_invest_preference TEXT, -- Solo, Syndicate, Both
    important_traction_indicators TEXT, -- Comma-separated or JSON array: Revenue, Team, etc.
    -- Availability & Goals
    actively_investing_next_3_months BOOLEAN,
    monitoring_for_future BOOLEAN,
    connections_goal TEXT,
    joining_reason TEXT,
    profile_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Subscriptions Table (for Companies)
CREATE TABLE Subscriptions (
    id TEXT PRIMARY KEY, -- Subscription ID from Stripe
    user_id TEXT NOT NULL,
    stripe_customer_id TEXT NOT NULL,
    status TEXT NOT NULL, -- active, canceled, past_due, etc.
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Messages Table
CREATE TABLE Messages (
    id TEXT PRIMARY KEY, -- Unique message ID (e.g., UUID)
    conversation_id TEXT NOT NULL, -- Identifier for a conversation thread
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(id),
    FOREIGN KEY (recipient_id) REFERENCES Users(id)
);

-- Conversations Table (to group messages and manage participants)
CREATE TABLE Conversations (
    id TEXT PRIMARY KEY, -- Unique conversation ID (e.g., UUID)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation Participants Table
CREATE TABLE ConversationParticipants (
    conversation_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
