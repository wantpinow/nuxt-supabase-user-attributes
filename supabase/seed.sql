-- Turn DB triggers off

SET session_replication_role = replica;

-- Insert example users into auth schema

INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'ee3f296a-f9e6-4765-af56-1b0edb30f28e', 'authenticated', 'authenticated', 'admin@test.com', '$2a$10$BYyZI/LWEUIj6YglRCcYT.Z0lxmkJ.XfaNfIWGD8/oNmY9R586BES', '2022-07-04 09:12:04.149858+00', NULL, '', NULL, '', NULL, '', '', NULL, '2022-07-04 09:12:04.154414+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '2022-07-04 09:12:04.141304+00', '2022-07-04 09:12:04.141307+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL);
INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', '7ffef084-73e4-4fa3-9e47-2c7acb751a72', 'authenticated', 'authenticated', 'user@test.com', '$2a$10$7Af04QTQKtenaxmcGmQqHOsiAA9EFlmFxe7fMBHivZJaeG4mPaqby', '2022-07-04 09:11:47.10654+00', NULL, '', NULL, '', NULL, '', '', NULL, '2022-07-04 09:12:18.182535+00', '{"provider": "email", "providers": ["email"]}', '{}', false, '2022-07-04 09:11:47.058006+00', '2022-07-04 09:11:47.058009+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL);

INSERT INTO auth.identities VALUES ('7ffef084-73e4-4fa3-9e47-2c7acb751a72', '7ffef084-73e4-4fa3-9e47-2c7acb751a72', '{"sub": "7ffef084-73e4-4fa3-9e47-2c7acb751a72"}', 'email', '2022-07-04 09:11:47.100135+00', '2022-07-04 09:11:47.10017+00', '2022-07-04 09:11:47.100174+00');
INSERT INTO auth.identities VALUES ('ee3f296a-f9e6-4765-af56-1b0edb30f28e', 'ee3f296a-f9e6-4765-af56-1b0edb30f28e', '{"sub": "ee3f296a-f9e6-4765-af56-1b0edb30f28e"}', 'email', '2022-07-04 09:12:04.147077+00', '2022-07-04 09:12:04.147098+00', '2022-07-04 09:12:04.1471+00');

-- Insert example users into public schema (both passwords are 12345678)

INSERT INTO public.profiles VALUES ('7ffef084-73e4-4fa3-9e47-2c7acb751a72');
INSERT INTO public.profiles VALUES ('ee3f296a-f9e6-4765-af56-1b0edb30f28e');

INSERT INTO public.user_metadata VALUES ('ee3f296a-f9e6-4765-af56-1b0edb30f28e', 'admin', 'admin@test.com');
INSERT INTO public.user_metadata VALUES ('7ffef084-73e4-4fa3-9e47-2c7acb751a72', 'user', 'user@test.com');

-- Turn DB triggers back on

SET session_replication_role = DEFAULT;