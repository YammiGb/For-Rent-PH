-- Move 'more' category after 'winter-edition' by bumping its sort_order to max + 1
DO $$
DECLARE
  max_order integer;
BEGIN
  SELECT COALESCE(MAX(sort_order), 0) INTO max_order FROM categories;
  UPDATE categories SET sort_order = max_order + 1 WHERE id = 'more';
END $$;

