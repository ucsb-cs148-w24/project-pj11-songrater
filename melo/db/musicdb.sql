<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 102e0808 (set up sql database)
-- Database: musicdb

-- DROP DATABASE IF EXISTS musicdb;

CREATE DATABASE musicdb
    WITH
    OWNER = adas16
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

<<<<<<< HEAD
=======
=======
>>>>>>> 102e0808 (set up sql database)
-- Table: public.User

-- DROP TABLE IF EXISTS public."User";
USE musicdb;

CREATE TABLE IF NOT EXISTS public."User"
(
    id integer NOT NULL,
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT "User_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."User"
    OWNER to postgres;

-- Table: public.User_Lists

-- DROP TABLE IF EXISTS public."User_Lists";

CREATE TABLE IF NOT EXISTS public."User_Lists"
(
    user_id integer NOT NULL,
    song_id integer NOT NULL,
    rank integer,
    review character varying(1023) COLLATE pg_catalog."default",
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."User_Lists"
    OWNER to postgres;

-- Table: public.Friend

-- DROP TABLE IF EXISTS public."Friend";

CREATE TABLE IF NOT EXISTS public."Friend"
(
    uid1 integer NOT NULL,
    uid2 integer NOT NULL,
    CONSTRAINT uid1 FOREIGN KEY (uid1)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT uid2 FOREIGN KEY (uid2)
        REFERENCES public."User" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Friend"
    OWNER to postgres;
>>>>>>> 6aa26d1c (set up sql database)
