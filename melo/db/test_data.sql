DELETE FROM public."User";
DELETE FROM public."User_Lists_Good";
DELETE FROM public."User_Lists_Ok";
DELETE FROM public."User_Lists_Bad";

INSERT INTO public."User"(
	id, username, email, description)
	VALUES (1, 'test_user_1', 'test_user_1@gmail.com', 'This is a test user description!');

INSERT INTO public."User"(
	id, username, email, description)
	VALUES (2, 'test_user_2', 'test_user_2@gmail.com', '');

INSERT INTO public."User_Lists_Good"(
    user_id, song_id, rank, review)
    VALUES (1, 1234, 2, 'This is a test song rating!');

INSERT INTO public."User_Lists_Good"(
    user_id, song_id, rank, review)
    VALUES (1, 123, 1, '');

INSERT INTO public."User_Lists_Good"(
    user_id, song_id, rank, review)
    VALUES (1, 123, 3, '');

INSERT INTO public."User_Lists_Good"(
    user_id, song_id, rank, review)
    VALUES (2, 111, 1, '');

INSERT INTO public."User_Lists_Ok"(
    user_id, song_id, rank, review)
    VALUES (1, 123, 3, '');

INSERT INTO public."User_Lists_Ok"(
    user_id, song_id, rank, review)
    VALUES (1, 432, 1, '');

INSERT INTO public."User_Lists_Ok"(
    user_id, song_id, rank, review)
    VALUES (1, 333, 2, '');

INSERT INTO public."User_Lists_Bad"(
    user_id, song_id, rank, review)
    VALUES (1, 123, 3, '');

INSERT INTO public."User_Lists_Bad"(
    user_id, song_id, rank, review)
    VALUES (1, 432, 1, '');

INSERT INTO public."User_Lists_Bad"(
    user_id, song_id, rank, review)
    VALUES (1, 333, 2, '');