---
partial_id: "027"
artifact: ADM
window_name: "Import Parser Fields"
class_name: ImportFields
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.import_parser_fields.png
mockup: mockups/ImportFields.html
window_type: Widget
phase: 3
status: done
---

# UI Contract: Import Parser Fields

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ImportFields |
| Typ | Widget (RDWidget) |
| Tytuł okna | (brak - widget osadzony) |
| Modalność | N/A (embedded) |
| Rodzic | EditSvc (dwa instancje: svc_tfc_fields i svc_mus_fields) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/importfields.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.import_parser_fields.png |
| Mockup HTML | ✅ | mockups/ImportFields.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak konstruktor params) | - | - | - |
| svc + type (via setFields) | RDSvc*, RDSvc::ImportSource | EditSvc | tak (po konstrukcji) |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| cart_offset_spin | QSpinBox | Cart Number: Offset: | Offset pola cart (0-1024) | valueChangedData() |
| cart_length_spin | QSpinBox | Length: | Długość pola cart (0-6) | valueChangedData() |
| title_offset_spin | QSpinBox | Title: Offset: | Offset pola title (0-1024) | valueChangedData() |
| title_length_spin | QSpinBox | Length: | Długość pola title (0-255) | valueChangedData() |
| hours_offset_spin | QSpinBox | Start Time - Hours: Offset: | Offset godzin startu (0-MAX) | valueChangedData() |
| hours_length_spin | QSpinBox | Length: | Długość godzin startu (0-8) | valueChangedData() |
| minutes_offset_spin | QSpinBox | Start Time - Minutes: Offset: | Offset minut startu (0-MAX) | valueChangedData() |
| minutes_length_spin | QSpinBox | Length: | Długość minut startu (0-8) | valueChangedData() |
| seconds_offset_spin | QSpinBox | Start Time - Seconds: Offset: | Offset sekund startu (0-MAX) | valueChangedData() |
| seconds_length_spin | QSpinBox | Length: | Długość sekund startu (0-8) | valueChangedData() |
| len_hours_offset_spin | QSpinBox | Length - Hours: Offset: | Offset godzin długości (0-MAX) | valueChangedData() |
| len_hours_length_spin | QSpinBox | Length: | Długość godzin długości (0-8) | valueChangedData() |
| len_minutes_offset_spin | QSpinBox | Length - Minutes: Offset: | Offset minut długości (0-MAX) | valueChangedData() |
| len_minutes_length_spin | QSpinBox | Length: | Długość minut długości (0-8) | valueChangedData() |
| len_seconds_offset_spin | QSpinBox | Length - Seconds: Offset: | Offset sekund długości (0-MAX) | valueChangedData() |
| len_seconds_length_spin | QSpinBox | Length: | Długość sekund długości (0-8) | valueChangedData() |
| data_offset_spin | QSpinBox | Globally Unique ID: Offset: | Offset GUID (0-MAX) | valueChangedData() |
| data_length_spin | QSpinBox | Length: | Długość GUID (0-32) | valueChangedData() |
| event_id_offset_spin | QSpinBox | Event ID: Offset: | Offset Event ID (0-MAX) | valueChangedData() |
| event_id_length_spin | QSpinBox | Length: | Długość Event ID (0-8) | valueChangedData() |
| annctype_offset_spin | QSpinBox | Annc. Type: Offset: | Offset typu ogłoszenia (0-MAX) | valueChangedData() |
| annctype_length_spin | QSpinBox | Length: | Długość typu ogłoszenia (0-8) | valueChangedData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po setFields() | Wszystkie spiny wypełnione z DB | - |
| Disabled | Template != [custom] | Wszystkie spiny disabled | setEnabled(false) |
| Enabled | Template == [custom] | Wszystkie spiny edytowalne | setEnabled(true) |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | Walidacja via QSpinBox range | (blokuje input) | input | QSpinBox min/max |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSvc (embedded) | Osadzony widget | setFields(RDSvc*, RDSvc::ImportSource) / readFields() |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Zgodne | Zgodne | Screenshot pokazuje fragment EditSvc z ImportFields |
