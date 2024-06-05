
-- run this file upon initial clone/start to create databases and seed with example data. This will help verify the databases and tables are properly set up for further tests/development. 

DROP DATABASE IF EXISTS eventspotter_dev;
CREATE DATABASE eventspotter_dev;
\connect eventspotter_dev;

\i eventspotter-schema.sql;
\i eventspotter-seed.sql;

DROP DATABASE IF EXISTS eventspotter_test;
CREATE DATABASE eventspotter_test;
\connect eventspotter_test;

\i eventspotter-schema.sql;
\i eventspotter-seed.sql;