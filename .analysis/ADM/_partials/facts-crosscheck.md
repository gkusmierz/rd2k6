# Crosscheck: rdadmin

## Sources compared
- facts-code.md: 40 facts from rdadmin/*.cpp
- facts-tests.md: 0 facts (no QTest files for rdadmin)
- facts-docs.md: 49 facts from docs/opsguide/rdadmin.xml

## Cross-validation summary

| Metric | Count |
|--------|-------|
| Facts confirmed by both code + docs | 18 |
| Code-only facts (hidden from docs) | 22 |
| Docs-only facts (not verifiable in rdadmin code) | 14 |
| Conflicts code vs docs | 1 |
| Edge cases from tests | 0 |

## TYP 1 -- In documentation, not in rdadmin code

| Fact from docs | XML section | Status |
|----------------|-------------|--------|
| Autofill carts algorithm (longest-first recursive fill) | sect.rdadmin.manage_services.general.configure_autofill_carts | logic_in_rdlogmanager (not rdadmin) |
| RDAirPlay dual output alternation behavior | rdadmin.manage_hosts.configure_rdairplay | logic_in_rdairplay (rdadmin only configures DB row) |
| Restart Log After Unclean Shutdown | rdadmin.manage_hosts.configure_rdairplay.start_stop_settings | logic_in_rdairplay |
| Sound Panel flash/pause behavior | rdadmin.manage_hosts.configure_rdairplay_sound_panel_settings | logic_in_rdairplay |
| RDLogEdit 2nd Start Button behavior | sect.rdadmin.manage_hosts.configuring_rdlogedit | logic_in_rdlogedit |
| Purge expired cuts mechanism | sect.rdadmin.manage_groups | logic_in_rdservice/rdmaint |
| ISCI cross reference (rdrepld) | sect.rdadmin.manage_system_settings | logic_in_rdrepld |

Note: These are NOT missing features. rdadmin only configures the DB rows; the actual behavior is implemented in the respective modules (rdairplay, rdlogmanager, rdservice, etc.). This is by design -- rdadmin is a pure configuration/admin UI.

## TYP 2 -- In code, not in documentation

| Fact from code | File | Status |
|----------------|------|--------|
| User cannot delete themselves (self-protection) | list_users.cpp:180 | hidden_feature (undocumented guard) |
| User cannot be deleted if set as default on station | list_users.cpp:196 | hidden_feature (undocumented guard) |
| New user auto-gets ALL group permissions | add_user.cpp:130 | hidden_feature (undocumented default) |
| New group auto-gets ALL user + service permissions | add_group.cpp:164 | hidden_feature (undocumented default) |
| User/Group creation rollback on cancel | add_user.cpp:141, add_group.cpp | hidden_feature |
| Feed deletion: remote audio/XML cleanup cascade | list_feeds.cpp:243-302 | needs_doc (complex multi-step) |
| Feed repost: 3-phase upload (images, data, XML) | list_feeds.cpp:320-392 | needs_doc |
| Dropbox RIPC notifications on CRUD | list_dropboxes.cpp:145-241 | needs_doc |
| PyPAD RIPC notifications on CRUD | list_pypads.cpp:198-249 | needs_doc |
| EditStation deferred save via 1ms QTimer | edit_station.cpp | hidden_feature |
| Group rename cascades through 6-7 tables | rename_group.cpp:155-227 | needs_doc (only partially documented) |
| Scheduler code deletion cascades to DROPBOX_SCHED_CODES | list_schedcodes.cpp:175 | needs_doc |

## TYP 3 -- Code vs Documentation conflict

| Code says | Docs say | File | Resolution |
|-----------|----------|------|------------|
| Group delete ALLOWS deletion even with carts (warns, then deletes carts + group) | Docs imply group with carts shown as warning but don't clearly state carts are deleted | list_groups.cpp:218-274 vs rdadmin.xml | code_wins -- code clearly deletes member carts then group; docs are incomplete |

## TYP 4 -- Edge cases from tests

No QTest files exist for rdadmin. No edge cases from test data available.
