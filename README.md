# Time Keeper — source and tools (not served)

- `timekeeper.html` — EN prototype source (same as the claude.ai artifact). `timekeeper_ru.html` — RU, generated.
- Build: put files in /home/claude, then
  - RU text: `python3 ru_apply.py && python3 ru_manual.py` (dictionary in `ru_dict.py`; only "T:Time Keeper" may stay untranslated)
  - EN site: `python3 build_site_en.py` -> site_en/index.html -> copy to branch `main` (GitHub Pages, time.whytfnot.studio)
  - RU site: `python3 build_site_ru.py` -> site_ru/index.html -> branch `ru` -> Yandex bucket xn--b1agvo1f.art (Cloud Shell: curl raw file by commit SHA, `yc storage s3 cp ... --content-type 'text/html; charset=utf-8' --cache-control 'no-cache'`)
  - Builds also need the static folders (img, fonts, js) from branch `main` next to site_en/.
- `tests/` — Playwright checks (scenes by wheel/trackpad/finger, first-screen layout on 7 screens). Serve site_en on :8766, site_ru on :8767.
