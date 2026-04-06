---
partial_id: "080"
artifact: ADM
window_name: "Edit Report {rptname}"
class_name: EditReport
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditReport.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Report

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditReport |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Report {rptname} |
| Modalność | modal |
| Rodzic | ListReports |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_report.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditReport.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| rptname | QString | Nazwa raportu z ListReports | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_description_edit | QLineEdit | &Report Description: | Opis raportu (max 64) | - |
| edit_filter_box | QComboBox | Export &Filter: | Typ filtra eksportu (RDReport::ExportFilter enum) | - |
| edit_stationid_edit | QLineEdit | Station ID: | Identyfikator stacji (max 16, RDTextValidator) | - |
| edit_cartzeros_box | QCheckBox | Use Leading Zeros | Wiodące zera w numerach kart | leadingZerosToggled() |
| edit_cartdigits_spin | QSpinBox | Digits: | Liczba cyfr (1-6) | - |
| edit_stationtype_box | QComboBox | Station Type: | Typ stacji (RDReport::StationType enum) | - |
| edit_linesperpage_spin | QSpinBox | Lines per Page: | Linie na stronę (10-200, hidden) | - |
| edit_servicename_edit | QLineEdit | Ser&vice Name: | Nazwa serwisu (max 64) | - |
| edit_stationformat_edit | QLineEdit | Station &Format: | Format stacji (max 64) | - |
| edit_path_edit | QLineEdit | Export Path: | Ścieżka eksportu Linux (max 255, RDTextValidator) | - |
| edit_postexport_cmd_edit | QLineEdit | Post Export Cmd: | Komenda po eksporcie (RDTextValidator) | - |
| edit_traffic_box | QCheckBox | Traffic | Eksportuj zdarzenia Traffic | - |
| edit_music_box | QCheckBox | Music | Eksportuj zdarzenia Music | - |
| edit_generic_box | QCheckBox | All | Eksportuj wszystkie typy zdarzeń | genericEventsToggledData() |
| edit_forcetraffic_box | QCheckBox | Traffic Log | Wymuszaj źródło: Traffic Log | - |
| edit_forcemusic_box | QCheckBox | Music Log | Wymuszaj źródło: Music Log | - |
| edit_onairflag_box | QComboBox | Include Only OnAir Events: | No/Yes | - |
| edit_daypart_check | QCheckBox | Filter by Daypart | Włącza filtrowanie po porze dnia | toggled → enable/disable time edits |
| edit_starttime_edit | Q3TimeEdit | Start Time: | Czas rozpoczęcia daypartu | - |
| edit_endtime_edit | Q3TimeEdit | End Time: | Czas zakończenia daypartu | - |
| edit_service_sel | RDListSelector | Available Services / Source Services | Przypisanie serwisów do raportu | - |
| edit_station_sel | RDListSelector | Available Hosts / Source Hosts | Przypisanie stacji do raportu | - |
| edit_group_box | QCheckBox | Filter by Groups | Włącza filtrowanie po grupach | toggled → enable/disable group_sel |
| edit_group_sel | RDListSelector | Available Groups / Allowed Groups | Przypisanie grup do raportu | - |
| ok_button | QPushButton | &OK | Zapisuje zmiany (default) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Leading Zeros ON | edit_cartzeros_box checked | Digits spin aktywny | - |
| Leading Zeros OFF | edit_cartzeros_box unchecked | Digits spin disabled | edit_cartdigits_label, edit_cartdigits_spin disabled |
| Generic Events ON | edit_generic_box checked | Traffic/Music checkboxy disabled | edit_traffic_box, edit_music_box, edit_traffic_label, edit_music_label disabled |
| Generic Events OFF | edit_generic_box unchecked | Traffic/Music checkboxy aktywne | - |
| Daypart ON | edit_daypart_check checked | Start/End time editable | - |
| Daypart OFF | edit_daypart_check unchecked | Start/End time disabled | edit_starttime_edit, edit_endtime_edit, labels disabled |
| Groups Filter ON | edit_group_box checked | Group selector aktywny | - |
| Groups Filter OFF | edit_group_box unchecked | Group selector disabled | edit_group_sel disabled |
| Lines per Page | Zawsze | Ukryty (hidden) | edit_linesperpage_spin + label hidden |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak jawnych walidacji) | - | - | - | okData() zapisuje bez sprawdzeń |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListReports | Edit / double-click / po Add | QString rptname |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | Brak screenshota | - | - |
