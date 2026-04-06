---
partial_id: "069"
artifact: ADM
window_name: "Add RSS Feed"
class_name: AddFeed
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddFeed.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Add RSS Feed

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddFeed |
| Typ | Dialog |
| Tytuł okna | RDADmin - Add RSS Feed |
| Modalność | non-modal (brak setModal) |
| Rodzic | ListFeeds |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_feed.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddFeed.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| id | unsigned* | ListFeeds (out) | tak |
| keyname | QString* | ListFeeds (out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_keyname_edit | QLineEdit | &New Feed Name: | nazwa feeda (max 8 znaków, bez spacji) | textChanged→keynameChangedData() |
| feed_users_box | QCheckBox | Enable Feed for All Users | domyślnie checked | - |
| feed_ok_button | QPushButton | &OK | tworzy feed | okData() |
| feed_cancel_button | QPushButton | &Cancel | zamyka bez tworzenia | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Puste pole | keyname puste | OK disabled | OK disabled |
| Pole wypełnione | keyname niepuste | OK enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| feed_keyname_edit | Max 8 znaków, bez spacji (RDTextValidator) | - | Na bieżąco | validator |
| feed_keyname_edit | Niepuste | OK disabled gdy puste | Na bieżąco | keynameChangedData |
| Tworzenie feeda | RDFeed::create() musi się powieść | err_msg z RDFeed::create | OK, błąd tworzenia | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListFeeds | addData() | id*, keyname* |
| AddFeed → done(0) | OK sukces | id i keyname ustawione |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
