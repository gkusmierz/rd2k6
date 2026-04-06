---
partial_id: "023"
artifact: ADM
window_name: "RDAdmin - Add Service"
class_name: AddSvc
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/AddSvc.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Add Service

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | AddSvc |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Add Service |
| Modalność | modal |
| Rodzic | ListSvcs |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/add_svc.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/AddSvc.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svcname | QString* | caller (output param) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_name_edit | QLineEdit | &New Service Name: | Wpisz nazwę serwisu (max 10 znaków, no spaces/tabs) | - |
| svc_exemplar_box | QComboBox | Base Service On: | Wybierz wzorzec (Empty Host Config lub istniejący serwis) | - |
| ok_button | QPushButton | &OK | Tworzy serwis, otwiera EditSvc | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka dialog (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Pusta nazwa, exemplar = "Empty Host Config" + lista serwisów | ok_button.default=true |
| Po OK | Walidacja OK | Tworzy serwis, otwiera EditSvc | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| svc_name_edit | Nie może być puste | "You must give the service a name!" | okData() | QMessageBox::warning |
| svc_name_edit | Max 10 chars, no spaces/tabs | (walidator blokuje input) | input | RDTextValidator |
| svc_name_edit | Serwis nie może istnieć | "Error" + err_msg | okData(), RDSvc::create fails | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSvcs → AddSvc | Klik "Add" | QString *svcname |
| AddSvc → EditSvc | Po udanym create | QString svc_name_edit->text() |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | - |
