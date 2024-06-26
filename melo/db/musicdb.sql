-- Database: musicdb

-- DROP DATABASE IF EXISTS musicdb;

CREATE DATABASE musicdb
    WITH
    OWNER = username
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False
    TEMPLATE = template0;