
DROP DATABASE eventspotter_dev;
CREATE DATABASE eventspotter_dev;
\connect eventspotter_dev;

\i eventspotter-schema.sql;
\i eventspotter-seed.sql;

DROP DATABASE eventspotter_test;
CREATE DATABASE eventspotter_test;
\connect eventspotter_test;

\i eventspotter-schema.sql;
\i eventspotter-seed.sql;