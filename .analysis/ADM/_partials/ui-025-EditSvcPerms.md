---
partial_id: "025"
artifact: ADM
window_name: "RDAdmin - Service: {name}"
class_name: EditSvcPerms
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditSvcPerms.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Service: {name}

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSvcPerms |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Service: {svc_name} |
| Modalność | modal |
| Rodzic | EditSvc |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_svc_perms.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditSvcPerms.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | RDSvc* | EditSvc (svc_svc) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_host_sel | RDListSelector | Available Hosts / Enabled Hosts | Dual-list selector: przenoszenie hostów między listami | - |
| ok_button | QPushButton | &OK | Zapisuje uprawnienia do DB i zamyka (done(0)) | okData() |
| cancel_button | QPushButton | &Cancel | Zamyka bez zapisu (done(1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Lewa lista: Available Hosts (stacje bez uprawnienia), Prawa: Enabled Hosts (z uprawnieniami) | ok_button.default=true |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| (brak) | - | - | - | - |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditSvc → EditSvcPerms | Klik "Enable Hosts" | RDSvc *svc |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Brak screenshota | - | sizeHint=400x212 |
