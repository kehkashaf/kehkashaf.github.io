# Kehkasha Dumasia — personal website

My first website, written by hand and published to the web from this repository.

**Live site:** https://kehkashaf.github.io

---

## What this is

A one-page personal site: an introduction, what I work with, the things I've
built, and how to reach me. No template and no build step — three files that a
browser can open directly.

| File | What it does |
| --- | --- |
| `index.html` | The structure and all of the content |
| `styles.css` | The look: layout, colour themes, animation |
| `script.js` | The behaviour: theme toggle, typing effect, scroll reveals, starfield |

## What it does

- **Two colour themes** — a dark default and a light mode, with your choice
  remembered in the browser for next time.
- **Animated background** — a drifting starfield drawn on an HTML `<canvas>`,
  layered over slow-moving gradient light.
- **Reveals on scroll** — sections fade in as you reach them, using
  `IntersectionObserver` rather than a scroll listener.
- **Works on any screen** — one column on a phone, a wider grid on a monitor.
- **Respects accessibility settings** — a skip link, visible focus rings,
  semantic landmarks, and every animation switched off for anyone who has asked
  their system for reduced motion.

## Why it lives on GitHub

A GitHub repository does three things for this project that a file on my laptop
cannot:

1. **It gives the work a public link.** Anyone — a recruiter, a teammate, a
   friend — can open the code and read it.
2. **It keeps the history.** Every change is a commit with a message and a date,
   so I can see how the site grew and go back to any earlier version.
3. **It lets other people in.** Someone can fork it, open an issue, or send a
   pull request suggesting a change, and I can review it before it goes live.

The site is served by **GitHub Pages** straight from the `main` branch, so the
repository and the live page are the same thing — every commit I push updates
what visitors see.

## Running it locally

No installation required. Clone the repository and open the page:

```bash
git clone https://github.com/kehkashaf/kehkashaf.github.io.git
cd kehkashaf.github.io
```

Then open `index.html` in a browser. To serve it over HTTP instead (closer to
how it behaves live), run one of these from the project folder:

```bash
python -m http.server 8000     # then visit http://localhost:8000
npx serve                       # if you have Node installed
```

## Making changes

Edit the files, then publish:

```bash
git add .
git commit -m "Describe what changed"
git push
```

GitHub Pages rebuilds within about a minute.

## What's next

The two placeholder cards in the **Work** section are there on purpose — a
portfolio is a list you keep adding to, not a page you finish once.

## Contact

- Email — kehkashadumasia98@gmail.com
- GitHub — [@kehkashaf](https://github.com/kehkashaf)

## Licence

Released under the [MIT Licence](LICENSE). Feel free to read the code, learn
from it, and build your own version.
