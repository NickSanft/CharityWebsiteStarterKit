# Good First Issues

These pre-written issues are designed to welcome new contributors. Create them in your GitHub repository after forking.

---

### 1. Add dark mode toggle
**Labels:** `good-first-issue`, `feature`

Add a dark mode toggle button to the site header. The project already has dark mode CSS variables defined in `globals.css`. The toggle should save the preference to `localStorage` and respect the system preference by default.

---

### 2. Add "Back to Top" button
**Labels:** `good-first-issue`, `feature`

Add a floating "Back to Top" button that appears when the user scrolls down on long pages. Use the `ArrowUp` icon from lucide-react.

---

### 3. Add blog post reading time estimate
**Labels:** `good-first-issue`, `feature`

Calculate and display an estimated reading time on blog posts. The average reading speed is ~200 words per minute. Display it next to the date on both the blog listing cards and detail page.

---

### 4. Add event countdown
**Labels:** `good-first-issue`, `feature`

On event detail pages, show a countdown timer (days, hours, minutes) for upcoming events. Use a client component that updates every minute.

---

### 5. Improve mobile navigation animation
**Labels:** `good-first-issue`, `accessibility`

The mobile menu currently shows/hides instantly. Add a smooth slide-down animation using CSS transitions or the `tw-animate-css` utility already installed.

---

### 6. Add loading skeletons to admin pages
**Labels:** `good-first-issue`, `feature`

Admin pages that fetch data (dashboard, posts list, volunteers list) should show skeleton loading states while data loads. Create a reusable `Skeleton` UI component.

---

### 7. Add pagination to admin posts list
**Labels:** `good-first-issue`, `feature`

The admin posts list currently shows all posts. Add pagination (10 per page) with Previous/Next buttons, similar to the public blog listing.

---

### 8. Add confirmation dialog for post deletion
**Labels:** `good-first-issue`, `bug`

The admin currently has no delete button for blog posts. Add a delete button in the post edit page with a confirmation dialog to prevent accidental deletion.

---

### 9. Add alt text validation for cover images
**Labels:** `good-first-issue`, `accessibility`

When creating blog posts or events, prompt the user to enter alt text for cover images. Store it alongside the cover image URL and use it in the `<Image>` component's `alt` prop.

---

### 10. Add newsletter signup component
**Labels:** `good-first-issue`, `feature`

Create a newsletter signup component for the homepage and footer. It should collect an email address and store it in a new `NewsletterSubscriber` database model. No actual email sending needed — just the signup form and admin list.
