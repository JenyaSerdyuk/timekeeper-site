# Time Keeper — source and tools (not served)

- `timekeeper.html` — EN prototype source (same as the claude.ai artifact). `timekeeper_ru.html` — RU, generated.
- Build: put files in /home/claude, then
  - RU text: `python3 ru_apply.py && python3 ru_manual.py` (dictionary in `ru_dict.py`; only "T:Time Keeper" may stay untranslated)
  - EN site: `python3 build_site_en.py` -> site_en/index.html -> copy to branch `main` (GitHub Pages, time.whytfnot.studio)
  - RU site: `python3 build_site_ru.py` -> site_ru/index.html -> branch `ru` -> Yandex bucket xn--b1agvo1f.art (Cloud Shell: curl raw file by commit SHA, `yc storage s3 cp ... --content-type 'text/html; charset=utf-8' --cache-control 'no-cache'`)
  - Builds also need the static folders (img, fonts, js) from branch `main` next to site_en/.
- `tests/` — Playwright checks (scenes by wheel/trackpad/finger, first-screen layout on 7 screens). Serve site_en on :8766, site_ru on :8767.

## 3D exploded view of the painting (pending)
- Approved-to-check preview: `render/preview/painting_before_after.png` (left: current site frames, right: new render). New frames 00 and 40 in `render/preview/`.
- Script: `render/ex3.py` (Blender, Cycles), uses helpers `render/tk.py`, `render/ex.py`. Run: `blender -b -P render/ex3.py -- painting <start> <end> 41 680 752 <samples> <outdir>`; env: FIN=silver, REFL, GIOR, PRO, PANI (the exact values of the preview were not recorded; match frames 00/40 against the preview).
- Site uses `img/xva/e00.jpg … e40.jpg` (+ `as0-3`, `bs0-3` turntable frames, `meta.json` label positions).

## Painting render — done (30 Oct)
- Settings that match the preview: `REFL=2 PRO=0.12 PANI=0.6 FIN=silver`, samples 48, 680x752.
- Run: E frames `python3 ex3.py -- painting 0 41 41 680 752 48 out_E`, turntables `TURN=A ... 0 48 48 ...` and `TURN=B ...` (bpy 5.2 from pip works).
- Light cards are now hidden from the camera; the faint panel ghost above the object is cut from the alpha (top rows above the object) before assembling.
- Assemble: `python3 render/assemble3.py <prefix> img/xva 0.7` (prefix_E, prefix_A, prefix_B). Site cache key V='?v=15'.
