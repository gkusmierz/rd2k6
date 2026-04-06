---
partial_id: "016"
artifact: ADM
window_name: "RDAdmin - User: {username}"
class_name: EditFeedPerms
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditFeedPerms.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Feed Permissions

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditFeedPerms |
| Typ | Dialog |
| Tytuł okna | RDAdmin - User: {username} |
| Modalność | modal |
| Rodzic | EditUser |
| Rozmiar | 400x212 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_feed_perms.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditFeedPerms.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| user | RDUser* | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_host_sel | RDListSelector | Available Feeds / Enabled Feeds | przenoszenie feedów między listami | - |
| ok_button | QPushButton | &OK | zapisuje perms do DB | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | otwarcie | dwie listy: available i enabled feeds | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | brak walidacji | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditUser | przycisk Podcast Feed Permissions | RDUser* |

## Logika biznesowa
- Pobiera FEED_PERMS i FEEDS z DB
- OK: dodaje nowe feedy do FEED_PERMS, usuwa usunięte
- Cancel: done(1) bez zmian
