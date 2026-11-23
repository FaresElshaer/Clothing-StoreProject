# StyleHub – Six-person team plan

The assignments below use file ownership to reduce merge conflicts. Each member should coordinate before changing a file owned by another member.

| Member | Responsibility | Main files | Deliverables |
|---|---|---|---|
| Member 1 – Pages & Navigation | HTML structure, page content, navigation, forms, accessibility basics | `index.html`, `products.html`, `cart.html` | Consistent page layout, working links, correct element IDs expected by JavaScript |
| Member 2 – UI & Responsive Design | Visual design, layout, responsive behavior | `assets/css/style.css` | Consistent styling on desktop/mobile; no broken layouts |
| Member 3 – Frontend JavaScript | Product loading/rendering, search/filter, cart, discounts, checkout interaction | `assets/js/script.js`, `assets/js/data.js` | Frontend behavior works with the existing HTML and API contract |
| Member 4 – Products API | Product retrieval endpoint | `backend/api/products.php` | `GET` endpoint returns product JSON and sensible error responses |
| Member 5 – Orders API & DB connection | Order validation, transaction, saving order items, PDO connection | `backend/api/orders.php`, `backend/api/db.php` | `POST` endpoint validates input and saves consistent order totals |
| Member 6 – Database & Integration / QA | Schema, sample data, end-to-end testing, setup docs, release coordination | `database/stylehub_db.sql`, `README.md`, `docs/TEAM_TASKS.md` | Database imports cleanly; test checkout end-to-end; review PRs and coordinate integration |

## Shared API contract

### Products

- Method: `GET`
- Path: `backend/api/products.php`
- Success response: JSON array of products with `id`, `name`, `category`, `price`, and `image`.

### Create order

- Method: `POST`
- Path: `backend/api/orders.php`
- Request JSON contains `customer`, `items`, `totals`, and `deliveryMessage`.
- Customer fields used by the backend: `name`, `phone`, `email`, `address`, and `notes`.
- Each item needs a product `id` and positive `quantity`. The backend reloads product prices from the database before calculating totals.
- Success response includes `success`, `order_id`, `totals`, and `deliveryMessage`.

Do not change endpoint paths or JSON field names without coordinating with Member 3 (frontend) and the relevant backend member.

## GitHub workflow

1. One person creates the GitHub repository and pushes the clean project structure.
2. Add all six members as collaborators (or grant repository access through the team organization).
3. Each member clones the repository once.
4. Each member creates a branch from the latest `main`, for example:
   - `feature/pages-navigation`
   - `feature/responsive-css`
   - `feature/frontend-js`
   - `feature/products-api`
   - `feature/orders-api`
   - `feature/database-qa`
5. Commit only related changes with clear messages, e.g. `Add product category filter`.
6. Push the branch and open a Pull Request into `main`.
7. Member 6 coordinates integration checks; at least one other member reviews each PR.
8. Resolve conflicts in the feature branch. Do not force-push to `main` or commit directly to it.

## Definition of done

- All three pages load through XAMPP.
- Product data loads from MySQL through the products endpoint.
- Search and category filter work.
- Cart quantity, remove, and discount features work.
- A valid checkout creates one order and its order items.
- Invalid requests do not create partial orders.
- README setup instructions work on a teammate's machine.
