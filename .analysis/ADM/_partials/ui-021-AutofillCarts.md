---
partial_id: "021"
artifact: ADM
window_name: "RDAdmin - Autofill Carts - Service: {svcname}"
class_name: AutofillCarts
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.autofill_carts_dialog.png
mockup: mockups/AutofillCarts.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Autofill Carts

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AutofillCarts |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Autofill Carts - Service: {svcname} |
| Modalność | modal |
| Rodzic | EditGroup (via service config) |
| Rozmiar | 375x310 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/autofill_carts.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.autofill_carts_dialog.png |
| Mockup HTML | ✅ | mockups/AutofillCarts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | RDSvc* | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_cart_list | Q3ListView | (Cart, Length, Title, Artist) | wyświetla listę autofill cartów | - |
| add_button | QPushButton | &Add | otwiera RDCartDialog (audio only) | addData() |
| delete_button | QPushButton | &Delete | usuwa wybrany cart z listy | deleteData() |
| ok_button | QPushButton | &OK | zapisuje do DB | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

### Kolumny Q3ListView
| # | Nagłówek | Alignment | Źródło |
|---|----------|-----------|--------|
| 0 | Cart | center | AUTOFILLS.CART_NUMBER (format %06d) |
| 1 | Length | right | CART.FORCED_LENGTH (RDGetTimeLength) |
| 2 | Title | left | CART.TITLE |
| 3 | Artist | left | CART.ARTIST |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Lista pusta | brak autofill cartów | pusta lista | brak |
| Lista wypełniona | są autofill carty | lista cartów z metadanymi | brak |
| Brak zaznaczenia | nic nie wybrane | Delete nie działa (early return) | brak |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | brak walidacji | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditGroup (service config) | przycisk Autofill Carts | RDSvc* |
| AutofillCarts → RDCartDialog | przycisk Add | filter: RDCart::Audio |

## Logika biznesowa
- Lista sortowana po kolumnie Length (sortColumn=1)
- OK: czyści AUTOFILLS dla danego serwisu, wstawia od nowa
- Cancel: done(1) bez zmian

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Screenshot odpowiada kodowi |
