-- Get the user ID for ceo@neuralpositive.com and update their role to admin
UPDATE user_roles 
SET role = 'admin', updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'ceo@neuralpositive.com'
);

-- If no role exists, insert one
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'ceo@neuralpositive.com'
  AND id NOT IN (SELECT user_id FROM user_roles WHERE user_id = auth.users.id);