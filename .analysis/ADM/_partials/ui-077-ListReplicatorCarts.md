---
partial_id: "077"
artifact: ADM
window_name: "{replname} Replicator Carts"
class_name: ListReplicatorCarts
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListReplicatorCarts.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Replicator Carts

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListReplicatorCarts |
| Typ | Dialog |
| Tytuł okna | RDAdmin - {replname} Replicator Carts |
| Modalność | modal |
| Rodzic | ListReplicators |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_replicator_carts.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListReplicatorCarts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| replname | const QString& | Nazwa replikatora z ListReplicators | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | RDListView | Active Carts: | Wyświetla karty replikatora (icon, CART, TITLE, LAST POSTED, POSTED FILENAME) | - |
| list_repost_button | QPushButton | &Repost | Oznacza wybraną kartę do repostu (REPOST=Y) | repostData() |
| list_repost_all_button | QPushButton | Repost\n&All | Oznacza wszystkie karty replikatora do repostu | repostAllData() |
| list_close_button | QPushButton | &Close | Zamyka dialog (default) | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Pusta lista | Brak kart w REPL_CART_STATE | Pusta tabela z nagłówkami | - |
| Lista z danymi | Istnieją karty | Tabela z ikonami (Audio=play, Macro=rml5), numerem, tytułem, datą i plikiem | - |
| Auto-refresh | Co 5 sekund | Aktualizacja kolumny LAST POSTED | Timer 5000ms (single-shot, restartowany) |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Zaznaczenie (repost) | Wymaga wybranego itemu | (brak komunikatu, return) | Klik Repost bez zaznaczenia | repostData() |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReplicators | Przycisk List Carts | QString replname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |
