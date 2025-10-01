-- Remove previously seeded payment methods if present
DELETE FROM payment_methods WHERE id IN ('gcash', 'bpi', 'seabank', 'unionbank');

