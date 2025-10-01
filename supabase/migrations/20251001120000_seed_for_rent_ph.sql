-- Payment Methods seed (exactly four)
INSERT INTO payment_methods (id, name, account_number, account_name, qr_code_url, active, sort_order)
VALUES
  ('gcash', 'GCash', '', '', '/logo.jpg', true, 1),
  ('bpi', 'BPI', '', '', '/logo.jpg', true, 2),
  ('seabank', 'SeaBank', '', '', '/logo.jpg', true, 3),
  ('unionbank', 'UnionBank', '', '', '/logo.jpg', true, 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  active = true;
/*
  Seed For Rent PH categories and items
  - Categories: Addons, Jurassic Dinosaurs, Pokémon, Sumo Wrestlers, Toy Story, More, Disney, Marvel, Justice League, Gender Reveal Babies, Winter Edition
  - Items with base prices; variations where applicable
*/

-- Categories
INSERT INTO categories (id, name, icon, sort_order, active)
VALUES
  ('addons', 'Addons', '🧰', 1, true),
  ('jurassic-dinosaurs', 'Jurassic Dinosaurs', '🦖', 2, true),
  ('pokemon', 'Pokémon', '⚡', 3, true),
  ('sumo-wrestlers', 'Sumo Wrestlers', '🥋', 4, true),
  ('toy-story', 'Toy Story', '🤖', 5, true),
  ('more', 'More', '✨', 6, true),
  ('disney', 'Disney', '🏰', 7, true),
  ('marvel', 'Marvel', '🛡️', 8, true),
  ('justice-league', 'Justice League', '🦇', 9, true),
  ('gender-reveal-babies', 'Gender Reveal Babies', '👶', 10, true),
  ('winter-edition', 'Winter Edition', '❄️', 11, true)
ON CONFLICT (id) DO NOTHING;

-- Helper: insert simple item
-- name, price, category
WITH items(name, price, category) AS (
  VALUES
  -- Addons
  ('Batteries (pack of four)', 50, 'addons'),
  ('Buzz Lightyear Gun', 200, 'addons'),
  ('Pokeball', 100, 'addons'),

  -- Jurassic Dinosaurs
  ('Trex', 500, 'jurassic-dinosaurs'),
  ('Triceratops', 500, 'jurassic-dinosaurs'),
  ('Blue Raptor', 1000, 'jurassic-dinosaurs'),

  -- Pokémon
  ('Pikachu', 500, 'pokemon'),
  ('Detective Pikachu', 500, 'pokemon'),
  ('Squirtle', 1000, 'pokemon'),
  ('Charizard', 1000, 'pokemon'),

  -- Sumo Wrestlers
  ('Sumo Wrestler (Black Belt)', 500, 'sumo-wrestlers'),
  ('Sumo Wrestler (Red Belt)', 500, 'sumo-wrestlers'),

  -- Toy Story
  ('Light Green Men', 1000, 'toy-story'),

  -- More
  ('Mario Yoshi', 1000, 'more'),
  ('Giraffe', 500, 'more'),
  ('Alien Abduction', 1000, 'more'),
  ('Security Deposit', 1000, 'more'),
  ('Rainbow Wings', 500, 'more'),
  ('Hello Kitty', 1000, 'more'),
  ('Minions', 1000, 'more'),
  ('No Face Man', 500, 'more'),
  ('Roblox', 500, 'more'),

  -- Disney
  ('Baymax', 1000, 'disney'),
  ('Star Wars BB8 Kids', 1000, 'disney'),

  -- Marvel
  ('Captain America', 500, 'marvel'),
  ('Hulk', 500, 'marvel'),
  ('Deadpool', 1000, 'marvel'),
  ('Wolverine', 1000, 'marvel'),

  -- Justice League
  ('Batman', 500, 'justice-league'),
  ('Superman', 500, 'justice-league'),

  -- Gender Reveal Babies
  ('Baby Boy', 500, 'gender-reveal-babies'),
  ('Baby Girl', 500, 'gender-reveal-babies'),

  -- Winter Edition
  ('Olaf', 1000, 'winter-edition'),
  ('Santa', 500, 'winter-edition')
)
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url, discount_price, discount_start_date, discount_end_date, discount_active)
SELECT 
  name,
  '',
  price,
  category,
  false,
  true,
  NULL,
  NULL,
  NULL,
  NULL,
  false
FROM items
ON CONFLICT DO NOTHING;

-- Toy Story: Buzz Lightyear with variations (Adult, Kids)
WITH inserted AS (
  INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url, discount_active)
  VALUES ('Buzz Lightyear', '', 1000, 'toy-story', false, true, NULL, false)
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO variations (menu_item_id, name, price)
SELECT id, v.name, v.price
FROM inserted
CROSS JOIN (
  VALUES ('Adult', 0), ('Kids', 0)
) AS v(name, price);


