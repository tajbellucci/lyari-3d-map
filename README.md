# Lyari 3D Crisis Map

An AWWWARDS-level interactive 3D crisis map documenting 8 critical issues facing Lyari, one of Karachi's oldest and most densely populated districts.

## Live Demo

**https://tajbellucci.github.io/lyari-3d-map/**

## Features

- **3D Map** with MapLibre GL and extruded buildings
- **GSAP Animations** - preloader, card reveals, modal transitions, custom cursor
- **Light/Dark Mode** with proper contrasting colors
- **EN/UR Toggle** - full Urdu translation with RTL layout swap (Ctrl+L)
- **8 Critical Issues** with Lyari Transformation Project (Rs 25.28B) as the primary focus
- **Accountability Chain** - visual flow showing local, municipal, provincial, and federal responsible persons
- **Community Submissions** - users can submit issues with photo upload
- **Admin Panel** - password-protected panel to approve/reject community submissions
- **IndexedDB Database** - persistent storage with localStorage fallback
- **UC-Level Data** - specific sub-issues for all 13 Union Councils
- **Real Official Contacts** - phone, email, office, social media for responsible persons

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- [MapLibre GL JS](https://maplibre.org/) for mapping
- [GSAP](https://greensock.com/gsap/) for animations
- IndexedDB for client-side database
- GitHub Pages for hosting

## Project Structure

```
lyari-3d-map/
  index.html      - Main application
  styles.css      - All styles, themes, RTL support
  app.js          - ISSUES data, map logic, GSAP animations, UI
  admin.html      - Admin panel (password: hawa)
  db.js           - IndexedDB database layer
  assets/         - Images and static assets
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Toggle EN/UR language |
| `Ctrl+D` | Toggle light/dark mode |
| `Esc` | Close modals |

## Admin Panel

Access the admin panel at `/admin.html`. Password required.

- Review community-submitted issues
- Approve/reject submissions
- Approved issues appear on the main map with blue markers

## 13 Union Councils

Agra Taj Colony, Daryaabad, Nawabad, Khada Memon Society, Baghdadi, Moosa Lane, Shah Baig Line, Bihar Colony, Ragiwara, Singo Line, Chakiwara, Allama Iqbal Colony, Jinnahabad-Ghulam Shah Lane

## Data Sources

- Lyari Transformation Project - Rs 25.28B, inaugurated April 9, 2026
- Population: 949,878 (2023 census)
- Area: ~6 km
- TMC Lyari Chairman: Khalil Hoath (PPP)

## License

MIT
