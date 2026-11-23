# StyleHub – Clothing Store

StyleHub is a small e-commerce clothing store built with HTML, CSS, JavaScript, PHP (PDO), and MySQL.

## Project structure

```text
clothing-store/
├── index.html                 # Home page
├── products.html              # Product listing page
├── cart.html                  # Cart and checkout page
├── assets/
│   ├── css/style.css          # Main styles
│   └── js/
│       ├── data.js            # Legacy/static product data (kept for reference)
│       └── script.js          # Product, cart, discount, and checkout behavior
├── backend/
│   └── api/
│       ├── db.php             # PDO database connection
│       ├── products.php       # GET products endpoint
│       └── orders.php         # POST order endpoint
├── database/
│   └── stylehub_db.sql        # Database schema and sample products
├── docs/
│   └── TEAM_TASKS.md          # Six-person task ownership
├── archive/
│   └── legacy-frontend/       # Older duplicate frontend; not used by the live site
├── .gitignore
└── README.md
```

## Requirements

- XAMPP (Apache + MySQL)
- PHP with PDO MySQL enabled
- A modern browser

## Run locally with XAMPP

1. Copy the repository folder into `C:\xampp\htdocs\`.
2. Start Apache and MySQL from the XAMPP Control Panel.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Import `database/stylehub_db.sql` into MySQL. **Warning:** this script drops and recreates the `order_items`, `orders`, and `products` tables in `stylehub_db`; do not run it against a database containing data you need to keep.
5. Check the local credentials in `backend/api/db.php`. The committed defaults are the standard XAMPP values (`root` with an empty password); change them for your own local setup if needed. Never commit real production credentials.
6. Open `http://localhost/clothing-store/`.

Do not open the HTML files using `file://`; the browser must reach the PHP endpoints through Apache.

## API endpoints

- `GET /clothing-store/backend/api/products.php` – returns products from MySQL.
- `POST /clothing-store/backend/api/orders.php` – validates and saves an order and its items.

The frontend calls these endpoints using relative paths. If you change the folder layout, update the endpoint paths in `assets/js/script.js` too.

## Current features

- Product listing loaded from the MySQL `products` table.
- Product search and category filtering.
- Shopping cart stored in browser `localStorage`.
- Quantity increase/decrease and item removal.
- Discount codes: `STYLE10` (10%) and `STUDENT15` (15%).
- Checkout form and order persistence in `orders` and `order_items`.

## Team workflow

See [`docs/TEAM_TASKS.md`](docs/TEAM_TASKS.md) for file ownership and GitHub branch / pull request rules.
