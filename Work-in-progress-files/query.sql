DROP TABLE food;
CREATE TABLE food(
 	dateAdded timestamp ,
 	dateUpdated timestamp ,
	address VARCHAR,
	city VARCHAR,
	country VARCHAR,
 	latitude decimal,
	longitude decimal,
	postalCode INT,
	province VARCHAR,
	rName VARCHAR
);
DROP TABLE census;
CREATE TABLE census(
	postalCode int,
	household_Income int,
	population int,
	median_age decimal,
	per_capita_income int,
	poverty_count int,
	unemployment_count int
);
select * from census;


select distinct(census.postalCode), census.population, food.latitude, food.longitude 
from census
left join food on census.postalCode = food.postalCode
order by census.postalcode
;