-- PostgreSQL query to get all request data with related information
-- This query joins requests with users, addresses, and subjects

SELECT 
    r.id,
    r.title,
    r.description,
    r.price_amount,
    r.currency,
    r.urgency,
    r.status,
    r.type,
    r.level,
    r.schedule,
    r.gender_preference,
    r.online_meeting,
    r.offline_meeting,
    r.travel_meeting,
    r.languages,
    r.view_count,
    r.contacted_count,
    r.student_contacted_count,
    r.created_at,
    r.updated_at,
    r.user_id,
    
    -- User information (student who posted the request)
    u.name as student_name,
    u.email as student_email,
    u.phone as student_phone,
    u.avatar_url as student_avatar,
    u.whatsapp_verified,
    
    -- Address information
    a.street,
    a.city,
    a.state,
    a.zip,
    a.country,
    a.country_code,
    a.address_line_1,
    a.address_line_2,
    a.lat,
    a.lon,
    
    -- Subjects (aggregated)
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'name', s.name,
                'category', s.category
            )
        ) FILTER (WHERE s.id IS NOT NULL), 
        '[]'::json
    ) as subjects
    
FROM requests r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN addresses a ON r.address_id = a.id
LEFT JOIN request_subjects rs ON r.id = rs.request_id
LEFT JOIN subjects s ON rs.subject_id = s.id

GROUP BY 
    r.id, r.title, r.description, r.price_amount, r.currency, r.urgency, 
    r.status, r.type, r.level, r.schedule, r.gender_preference,
    r.online_meeting, r.offline_meeting, r.travel_meeting, r.languages,
    r.view_count, r.contacted_count, r.student_contacted_count,
    r.created_at, r.updated_at, r.user_id,
    u.name, u.email, u.phone, u.avatar_url, u.whatsapp_verified,
    a.street, a.city, a.state, a.zip, a.country, a.country_code,
    a.address_line_1, a.address_line_2, a.lat, a.lon

ORDER BY r.created_at DESC;

-- Alternative simpler query if you just want the basic request data:
-- SELECT * FROM requests ORDER BY created_at DESC;

-- Query to check what columns actually exist in the requests table:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'requests' 
-- ORDER BY ordinal_position;

-- Query to get a specific request by ID:
-- SELECT 
--     r.*,
--     u.name as student_name,
--     u.phone as student_phone,
--     u.whatsapp_verified,
--     a.city,
--     a.country
-- FROM requests r
-- LEFT JOIN users u ON r.user_id = u.id
-- LEFT JOIN addresses a ON r.address_id = a.id
-- WHERE r.id = 'your-request-id-here';
