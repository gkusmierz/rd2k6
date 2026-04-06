---
partial_id: "047"
artifact: ADM
window_name: "JACK Client Configuration"
class_name: EditJackClient
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditJackClient.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: JACK Client Configuration

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditJackClient |
| Typ | Dialog |
| Tytuł okna | "RDAdmin - JACK Client Configuration for {station_name}" |
| Modalność | modal |
| Rodzic | EditJack |
| Rozmiar | 450x130 (minimum, resizable) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_jack_client.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditJackClient.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| station | RDStation* | EditJack | tak |
| desc | QString* (in/out) | caller | tak |
| cmd | QString* (in/out) | caller | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| edit_jack_description_edit | QLineEdit | Description: | Opis klienta JACK | - |
| edit_jack_command_line_edit | QLineEdit | Command Line: | Linia komend klienta JACK | - |
| edit_ok_button | QPushButton | "&OK" | Zapisuje i zamyka (done(0)) | okData() |
| edit_cancel_button | QPushButton | "&Cancel" | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | zawsze | 2 pola tekstowe + OK/Cancel | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| edit_jack_command_line_edit | trimmed() na okData | (brak komunikatu) | okData() | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditJack | Przycisk "Add"/"Edit" | station, desc*, cmd* (via exec()) |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
