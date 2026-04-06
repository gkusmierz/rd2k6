---
partial_id: "068"
artifact: ADM
window_name: "Rivendell Feed List"
class_name: ListFeeds
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListFeeds.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Rivendell Feed List

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListFeeds |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Rivendell Feed List |
| Modalność | non-modal (brak setModal) |
| Rodzic | MainWidget |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_feeds.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListFeeds.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| - | - | - | Brak (odczytuje bezpośrednio z DB) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_feeds_view | RDListView | Podcast Feeds (columns: icon, Key, Title, Public URL, Superfeed, AutoPost, Creation Date) | wyświetla listę feedów | doubleClicked→doubleClickedData() |
| list_add_button | QPushButton | &Add | otwiera AddFeed, potem EditFeed | addData() |
| list_edit_button | QPushButton | &Edit | otwiera EditFeed | editData() |
| list_delete_button | QPushButton | &Delete | usuwa feed (z postępem) | deleteData() |
| list_repost_button | QPushButton | &Repost | repostuje cały feed | repostData() |
| list_unpost_button | QPushButton | &Unpost | usuwa remote data | unpostData() |
| list_close_button | QPushButton | &Close | zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak feedów | Pusta lista z ikoną i przyciskami | - |
| Lista z feedami | feedy istnieją | Lista z ikoną (32x32), Key, Title, URL, Superfeed Y/N, AutoPost Y/N, Data | - |
| Progress (delete) | deleteData() | QProgressDialog "Deleting remote audio..." | - |
| Progress (repost) | repostData() | QProgressDialog "Posting images...", "Posting item data...", "Posting RSS XML data..." | - |
| Progress (unpost) | unpostData() | QProgressDialog "Unposting..." (XML, items, images) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Wybrany feed (delete) | Potwierdzenie usunięcia | 'Are you sure you want to delete feed "X"?' | Delete | QMessageBox::warning |
| Repost | Potwierdzenie repost | "This operation will repost all XML, image and audio data..." | Repost | QMessageBox::question |
| Unpost | Potwierdzenie unpost | "This operation will unpost (remove) all XML, image and audio data..." | Unpost | QMessageBox::question |
| Delete remote XML | Ostrzeżenie | "Failed to delete remote feed XML." | removeRss() zwraca false | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| MainWidget | Menu/button | - |
| ListFeeds → AddFeed | Kliknięcie Add | id*, keyname* |
| ListFeeds → EditFeed | Kliknięcie Add (po AddFeed) lub Edit | feed keyname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
