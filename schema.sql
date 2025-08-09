CREATE TABLE public.profile (
  id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  email text,
  avatar_url text,
  CONSTRAINT profile_pkey PRIMARY KEY (id),
  CONSTRAINT profile_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.video (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  file_path text NOT NULL,
  is_public boolean NOT NULL DEFAULT false,
  duration bigint NOT NULL DEFAULT '0'::bigint,
  cover text,
  CONSTRAINT video_pkey PRIMARY KEY (id),
  CONSTRAINT video_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profile(id)
);