-- Fix: remove automatic admin assignment on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Add length constraints to public submission tables
ALTER TABLE public.contact_messages
  ADD CONSTRAINT msg_name_len CHECK (char_length(name) <= 200),
  ADD CONSTRAINT msg_email_len CHECK (char_length(email) <= 254),
  ADD CONSTRAINT msg_message_len CHECK (char_length(message) <= 5000);

ALTER TABLE public.order_submissions
  ADD CONSTRAINT ord_name_len CHECK (char_length(name) <= 200),
  ADD CONSTRAINT ord_email_len CHECK (char_length(email) <= 254),
  ADD CONSTRAINT ord_budget_len CHECK (char_length(budget) <= 100),
  ADD CONSTRAINT ord_details_len CHECK (char_length(details) <= 10000),
  ADD CONSTRAINT ord_service_len CHECK (service IS NULL OR char_length(service) <= 500),
  ADD CONSTRAINT ord_company_len CHECK (company IS NULL OR char_length(company) <= 200),
  ADD CONSTRAINT ord_phone_len CHECK (phone IS NULL OR char_length(phone) <= 50),
  ADD CONSTRAINT ord_package_len CHECK (package IS NULL OR char_length(package) <= 200),
  ADD CONSTRAINT ord_timeline_len CHECK (timeline IS NULL OR char_length(timeline) <= 200);