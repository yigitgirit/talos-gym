-- 'password' hash: $2a$10$X/wGzDk1b1zR92u7B.vBHe5/O0.e5.p9f3hE0Y13q4C38.0.7qC.
INSERT INTO users (email, password, first_name, last_name, status, version) VALUES
    ('admin@talosgym.com', '$2a$10$X/wGzDk1b1zR92u7B.vBHe5/O0.e5.p9f3hE0Y13q4C38.0.7qC.', 'Admin', 'User', 'ACTIVE', 0),
    ('trainer1@talosgym.com', '$2a$10$X/wGzDk1b1zR92u7B.vBHe5/O0.e5.p9f3hE0Y13q4C38.0.7qC.', 'John', 'Trainer', 'ACTIVE', 0),
    ('user1@talosgym.com', '$2a$10$X/wGzDk1b1zR92u7B.vBHe5/O0.e5.p9f3hE0Y13q4C38.0.7qC.', 'Jane', 'Doe', 'ACTIVE', 0)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'ADMIN' FROM users WHERE email = 'admin@talosgym.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'TRAINER' FROM users WHERE email = 'trainer1@talosgym.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'MEMBER' FROM users WHERE email = 'user1@talosgym.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_notification_preferences (user_id, category)
SELECT id, 'GENERAL_ANNOUNCEMENT' FROM users WHERE email = 'user1@talosgym.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_notification_preference_channels (preference_id, channel)
SELECT unp.id, 'EMAIL' FROM user_notification_preferences unp
JOIN users u ON unp.user_id = u.id
WHERE u.email = 'user1@talosgym.com' AND unp.category = 'GENERAL_ANNOUNCEMENT'
ON CONFLICT DO NOTHING;
