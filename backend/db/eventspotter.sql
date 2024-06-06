
 -- Initializes the development and test databases for the EventSpotter application by creating the necessary databases, applying schema changes, and seeding them with example data.

-- Create Development Database
DROP DATABASE IF EXISTS eventspotter_dev;
CREATE DATABASE eventspotter_dev;
\connect eventspotter_dev;

-- Apply Schema and Seed Data to Development Database
\i eventspotter-schema.sql;
\i eventspotter-seed.sql;

-- Create Test Database
DROP DATABASE IF EXISTS eventspotter_test;
CREATE DATABASE eventspotter_test;
\connect eventspotter_test;

-- Apply Schema and Seed Data to Test Database
\i eventspotter-schema.sql;
\i eventspotter-seed.sql;