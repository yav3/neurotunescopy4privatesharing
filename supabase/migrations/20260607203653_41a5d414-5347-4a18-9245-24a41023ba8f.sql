
DROP POLICY IF EXISTS "Public can create trial requests" ON public.trial_requests;
CREATE POLICY "Public can create trial requests"
ON public.trial_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(email) BETWEEN 5 AND 255
  AND char_length(full_name) BETWEEN 1 AND 200
  AND (company_name IS NULL OR char_length(company_name) <= 200)
  AND (employee_count IS NULL OR char_length(employee_count) <= 50)
  AND (notes IS NULL OR char_length(notes) <= 5000)
);

DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(email) BETWEEN 5 AND 255
  AND (name IS NULL OR char_length(name) <= 200)
  AND (company IS NULL OR char_length(company) <= 200)
  AND char_length(interest_type) BETWEEN 1 AND 100
  AND (source IS NULL OR char_length(source) <= 200)
);
