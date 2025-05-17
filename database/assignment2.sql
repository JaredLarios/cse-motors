SELECT *
FROM public.inventory;


SELECT inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color
FROM public.inventory
WHERE inv_make = 'Chevy';


SELECT *
FROM public.account;

-- query 1 --
INSERT INTO public.account(
	account_firstname, account_lastname, account_email, account_password)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- query 2 --
UPDATE public.account
SET account_type='Admin'
WHERE account_email = 'tony@starkent.com';

-- query 3 --
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- query 4 --
UPDATE public.inventory
set inv_description = (SELECT REPLACE (inv_description, 'the small interiors', 'a huge interior'))
WHERE inv_model = 'Hummer';

-- query 5 --
SELECT inv_make, inv_model, classification_name
FROM public.inventory i
	JOIN public.classification c ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';

-- query 6 --
UPDATE public.inventory
set inv_image = (SELECT REPLACE (inv_image, '/images', '/images/vehicles')),
inv_thumbnail = (SELECT REPLACE (inv_thumbnail, '/images', '/images/vehicles'));