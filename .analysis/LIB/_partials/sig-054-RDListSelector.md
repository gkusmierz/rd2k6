---
partial_id: 54
class_name: RDListSelector
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDListSelector

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| (brak — klasa nie deklaruje własnych sygnałów; nagłówek nie zawiera sekcji `signals:`) | — | — | — |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `list_add_button` (QPushButton) | `clicked()` | `addData()` | `lib/rdlistselector.cpp:42` |
| `list_remove_button` (QPushButton) | `clicked()` | `removeData()` | `lib/rdlistselector.cpp:46` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| (brak własnych sygnałów wychodzących) | — | — | — |

## Uwagi

RDListSelector jest dwukolumnowym widgetem wyboru (source → dest). Brak własnych sygnałów — stan pobierany synchronicznie przez metody sourceText/destText/destCount itp. Używany szeroko w rdadmin do zarządzania uprawnieniami (grupy, serwisy, hosty, feedy), rdlibrary (kody schedulera), rdlogmanager (serwisy zdarzeń).

Konsumenci: rdadmin/edit_user_perms.cpp, rdadmin/edit_feed_perms.cpp, rdadmin/edit_svc_perms.cpp, rdadmin/edit_replicator.cpp, rdadmin/edit_group.cpp, rdadmin/edit_report.cpp, rdlogmanager/edit_perms.cpp, rdlibrary/edit_schedulercodes.cpp, lib/rdschedcodes_dialog.cpp.

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
