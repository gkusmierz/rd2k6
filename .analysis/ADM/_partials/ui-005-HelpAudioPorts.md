---
partial_id: "005"
artifact: ADM
window_name: "RDAdmin - Audio Ports Help"
class_name: HelpAudioPorts
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/HelpAudioPorts.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Audio Ports Help Dialog

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | HelpAudioPorts |
| Typ | Dialog (RDDialog) |
| Tytuł okna | "RDAdmin - Audio Ports Help" |
| Modalność | modal (setModal(true)) |
| Rodzic | EditAudioPorts (from station config) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/help_audios.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/HelpAudioPorts.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| (brak) | - | - | - |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| help_edit | Q3TextEdit | Rich HTML help content | read-only, RichText | - |
| close_button | QPushButton | "&Close" | Zamyka dialog | closeData() |

## Layout (absolute positioning)
| Widget | Geometry (x, y, w, h) |
|--------|----------------------|
| help_edit | 10, 10, 580, 330 |
| close_button | 510, 340, 80, 50 |

Window size: 600 x 400 (fixed).

## Treść help_edit (RichText)
HTML table explaining Channel Mode behavior:
- Mono/Normal: L+R sum to mono
- Mono/Swap: R+L sum to mono (same as Normal)
- Mono/Left only: L -> mono
- Mono/Right only: R -> mono
- Stereo/Normal: Stereo
- Stereo/Swap: Swapped stereo
- Stereo/Left only: L -> L channel only, R silent
- Stereo/Right only: R -> R channel only, L silent

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| default | Zawsze | Tabela z opisem trybów audio | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditAudioPorts | Help button | brak |

## Rozbieżności screenshot <-> kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| (brak screenshota) | - | - | - |
