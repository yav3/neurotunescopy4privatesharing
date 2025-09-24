-- Update user roles to admin for specified users
UPDATE public.user_roles 
SET role = 'admin'
WHERE user_id IN (
  'b59bf8f7-f735-4232-bfa1-214dc2300803', -- chris@neuralpositive.com
  '6f70624d-6a94-4d79-be1a-de119afd1c1a', -- clong@neuralpositive.com  
  'a2d1f25a-7ea3-489c-80c6-b3d8123a232f', -- contact1@neuralpositive.com
  '96b35a5a-0e48-4e01-9566-6284925a6a70'  -- josh@neuralpositive.com
);