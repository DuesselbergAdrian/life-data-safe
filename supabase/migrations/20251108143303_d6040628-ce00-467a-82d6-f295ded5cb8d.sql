-- Add consent fields for sharing social graph metadata
ALTER TABLE consents 
ADD COLUMN IF NOT EXISTS share_community_memberships boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS share_circle_connections boolean DEFAULT false;

COMMENT ON COLUMN consents.share_community_memberships IS 'Allow sharing which communities the user is member of';
COMMENT ON COLUMN consents.share_circle_connections IS 'Allow sharing who is in the user''s inner circle';