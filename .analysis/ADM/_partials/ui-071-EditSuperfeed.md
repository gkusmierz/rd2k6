---
partial_id: "071"
artifact: ADM
window_name: "RSS Superfeed"
class_name: EditSuperfeed
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditSuperfeed.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RSS Superfeed

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSuperfeed |
| Typ | Dialog |
| Tytuł okna | RDAdmin - RSS Superfeed: {keyName} |
| Modalność | non-modal (brak setModal) |
| Rodzic | EditFeed |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_superfeed.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditSuperfeed.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| feed | RDFeed* | EditFeed | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_host_sel | RDListSelector | Available Feeds / Member Feeds | dual-list selector | - |
| ok_button | QPushButton | &OK | zapisuje mapowanie i zamyka | okData() |
| cancel_button | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | Dwie listy: Available Feeds (non-superfeedy) i Member Feeds (przypisane) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - RDListSelector zarządza przesuwaniem |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditFeed | Select Member Feeds | RDFeed* |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
