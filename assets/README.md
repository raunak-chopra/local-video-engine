# Asset drop folder

Drop licensed files into the matching subfolder. Keep original filenames
(Envato names carry the item ID, which is how licenses are traced).
Large media is git-ignored; only this README and `LICENSES.md` are tracked.

| Folder | What goes here | Formats |
|---|---|---|
| `footage/` | YOUR raw clips: talking head, screen recordings, phone video | mp4, mov |
| `broll/` | Envato stock video: cutaways, backgrounds, product/lifestyle shots | mp4, mov |
| `music/` | Envato Elements tracks (prefer versions with stems or a "30s/60s cut") | mp3, wav |
| `sfx/` | whooshes, hits, risers, clicks, UI sounds, pops | wav, mp3 |
| `motion-graphics/` | lower thirds, transitions, shape/light overlays. Prefer MOV with alpha or WebM with alpha. Not After Effects project files | mov, webm, mp4 |
| `overlays-and-luts/` | grain, light leaks, dust, film burn; .cube LUTs for colour | mp4, mov, cube |
| `fonts/` | the 1-2 fonts for captions/headlines | ttf, otf, woff2 |
| `images-and-logos/` | logo (SVG/PNG with transparency), product shots, photos | svg, png, jpg |
| `voiceover/` | any recorded or purchased voiceover | wav, mp3 |
| `references/` | reels you want to match in style (links in `links.txt` also fine) | mp4, txt |

Not usable: After Effects / Premiere / Final Cut templates (.aep, .prproj,
.mogrt). Remotion cannot render those. Export a rendered clip instead, or
tell me and I will rebuild the look in code.

Record each Envato item in `LICENSES.md` (item ID or URL, title, folder).
