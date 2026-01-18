-- Check if hot_tags table exists and show its schema
SELECT
    table_schema,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'hot_tags'
ORDER BY ordinal_position;

-- Also check all tables in the public schema
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
