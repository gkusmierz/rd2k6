---
partial_id: "057"
artifact: ADM
window_name: "Edit GPI"
class_name: EditGpi
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_gpi_dialog.png
mockup: mockups/EditGpi.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit GPI

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditGpi |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit GPI {N} |
| Modalność | modal (inherited) |
| Rodzic | ListGpis |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_gpi.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_gpi_dialog.png |
| Mockup HTML | ✅ | mockups/EditGpi.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| gpi | int | ListGpis | tak |
| oncart | int* | ListGpis (in/out) | tak |
| ondesc | QString* | ListGpis (in/out) | tak |
| offcart | int* | ListGpis (in/out) | tak |
| offdesc | QString* | ListGpis (in/out) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_on_group | QGroupBox | ON Transition | Grupa ON | - |
| edit_onmacro_edit | QLineEdit | Cart Number: (ON) | Numer cart ON macro | - |
| (on select btn) | QPushButton | &Select (ON) | Otwiera RDCartDialog (Macro only) | selectOnData() |
| (on clear btn) | QPushButton | C&lear (ON) | Czyści ON cart | clearOnData() |
| edit_ondescription_edit | QLineEdit | Description: (ON) | Opis cart ON (readonly) | - |
| edit_off_group | QGroupBox | OFF Transition | Grupa OFF | - |
| edit_offmacro_edit | QLineEdit | Cart Number: (OFF) | Numer cart OFF macro | - |
| (off select btn) | QPushButton | &Select (OFF) | Otwiera RDCartDialog (Macro only) | selectOffData() |
| (off clear btn) | QPushButton | C&lear (OFF) | Czyści OFF cart | clearOffData() |
| edit_offdescription_edit | QLineEdit | Description: (OFF) | Opis cart OFF (readonly) | - |
| ok_button | QPushButton | &OK | Waliduje, zapisuje carty do pointerów | okData() |
| cancel_button | QPushButton | &Cancel | done(-1) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Oba puste | Nowe GPI | Oba cart numbers puste, descriptions puste | - |
| ON assigned | oncart > 0 | ON Cart Number wypełniony, ON Description z tytułem cart | - |
| OFF assigned | offcart > 0 | OFF Cart Number wypełniony, OFF Description z tytułem cart | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| ON Cart Number | Poprawna liczba int | "Invalid Cart Number!" | OK + niepusty + nie-int | QMessageBox::warning |
| OFF Cart Number | Poprawna liczba int | "Invalid Cart Number!" | OK + niepusty + nie-int | QMessageBox::warning |
| ON/OFF Cart | RDTextValidator | - | Inline | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListGpis | editData() -> exec() | gpi, oncart*, ondesc*, offcart*, offdesc* |
| EditGpi -> RDCartDialog | selectOnData()/selectOffData() | cart number, RDCart::Macro filter |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| Tytuł | "Edit GPI 2" | "RDAdmin - Edit GPI 2" | Screenshot obcina prefix |
| Grupy | ON Transition, OFF Transition | QGroupBox z tymi tytułami | Zgodne |
| Przyciski | Select, Clear w obu sekcjach | &Select, C&lear | Zgodne |
| Description | Readonly, "Label Test" | readonly QLineEdit | Zgodne |
