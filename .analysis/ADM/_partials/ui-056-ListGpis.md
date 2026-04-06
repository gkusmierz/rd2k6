---
partial_id: "056"
artifact: ADM
window_name: "List GPIs / List GPOs"
class_name: ListGpis
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.list_gpis_dialog.png
mockup: mockups/ListGpis.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: List GPIs / GPOs

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListGpis |
| Typ | Dialog |
| Tytuł okna | RDAdmin - List GPIs / RDAdmin - List GPOs |
| Modalność | modal (inherited) |
| Rodzic | EditMatrix |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_gpis.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.list_gpis_dialog.png |
| Mockup HTML | ✅ | mockups/ListGpis.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| matrix | RDMatrix* | EditMatrix | tak |
| type | RDMatrix::GpioType | EditMatrix (GpioInput/GpioOutput) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_list_view | Q3ListView | GPI Lines / GPO Lines | Lista GPIO z cartami ON/OFF | - |
| list_list_view (dblclick) | Q3ListView | - | Otwiera EditGpi | doubleClickedData() |
| list_edit_button | QPushButton | &Edit | Otwiera EditGpi dla wybranego | editData() |
| list_ok_button | QPushButton | &OK | Usuwa stare, zapisuje nowe GPIO carts + wysyła RML GI | okData() |
| list_cancel_button | QPushButton | &Cancel | done(1) | cancelData() |

Kolumny Q3ListView:
- GPI / GPO (number)
- ON MACRO CART
- ON DESCRIPTION
- OFF MACRO CART
- OFF DESCRIPTION

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| GPI mode | type=GpioInput | Tytuł "List GPIs", kolumna "GPI", label "GPI Lines" | - |
| GPO mode | type=GpioOutput | Tytuł "List GPOs", kolumna "GPO", label "GPO Lines" | - |
| LiveWire | type=LiveWireLwrpAudio | 5-digit numbering (00001) | - |
| Standard | inne typy | 3-digit numbering (001), fixed size list | - |
| Unassigned | Brak cart | "[unassigned]" w ON/OFF DESCRIPTION | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | Brak walidacji na tym poziomie | - | - | Walidacja w EditGpi |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditMatrix | gpisButtonData()/gposButtonData() | RDMatrix*, GpioInput/GpioOutput |
| ListGpis -> EditGpi | editData() | gpi number, oncart*, ondesc*, offcart*, offdesc* |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "List GPIs" | "RDAdmin - List GPIs" | Screenshot obcina prefix |
| Kolumny | GPI, ON MACRO CART, ON DESCRIPTION, OFF MACRO CART, OFF DESCRIPTION | Zgodne | Zgodne |
| Przyciski | Edit, OK, Cancel | &Edit, &OK, &Cancel | Zgodne |
