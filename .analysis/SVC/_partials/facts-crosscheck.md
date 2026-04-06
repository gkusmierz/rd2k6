---
partial_id: crosscheck
artifact: SVC
phase: 5
status: done
---

# Crosscheck: rdservice

## TYP 2 — W kodzie, brak w dokumentacji

| Fakt z kodu | Plik | Status |
|-------------|------|--------|
| rdrepld conditional startup (REPLICATORS table check) | startup.cpp:164-178 | hidden_feature / needs_doc |
| rdrssd conditional startup (RSS_PROCESSOR_STATION check) | startup.cpp:187-206 | hidden_feature / needs_doc |
| SIGUSR1 dropbox hot-reload | rdservice.cpp:48-49, 196-201 | hidden_feature / needs_doc |
| Maintenance jitter (random interval 15-60 min) | maint_routines.cpp:108-113 | hidden_feature / needs_doc |
| Maintenance disable via config | rdservice.cpp:141-153 | hidden_feature / needs_doc |
| Dropbox processes from DROPBOXES table | startup.cpp:217-343 | partially documented (mentioned as "rdimport in dropbox mode") |
| Band-aid 1s sleep between rdpadd and rdpadengined | startup.cpp:120-125 | implementation_detail |
| --end-startup-after-rdrssd supported in code | startup.cpp:202-205 | hidden_feature (manpage lists only up to rdrepld) |

## TYP 3 — Sprzecznosc kod <-> dokumentacja

| Kod mowi | Docs mowi | Plik XML | Rozstrzygniecie |
|----------|-----------|----------|----------------|
| --force-system-maintenance | --force-service-maintenance | docs/manpages/rdservice.xml:options | kod_wins (docs has typo "service" vs "system") |
| Manpage missing --end-startup-after-rdrssd | Lists options only up to --end-startup-after-rdrepld | docs/manpages/rdservice.xml:options | kod_wins (rdrssd target exists in code) |

## TYP 4 — Edge cases (undocumented constraints)

Brak testow — nie mozna wyciagnac edge cases z testow.
