-- Run this in the Supabase SQL Editor to create the users table
-- This matches the Prisma schema and the API synchronization logic.

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  target_calories INTEGER DEFAULT 2400,
  base_expenditure INTEGER DEFAULT 2400,
  target_protein INTEGER DEFAULT 150,
  target_carbs INTEGER DEFAULT 250,
  target_water INTEGER DEFAULT 2000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
