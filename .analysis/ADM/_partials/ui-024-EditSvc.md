---
partial_id: "024"
artifact: ADM
window_name: "RDAdmin - Edit Service"
class_name: EditSvc
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.edit_service_dialog.png
mockup: mockups/EditSvc.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: RDAdmin - Edit Service

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditSvc |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Edit Service |
| Modalność | modal |
| Rodzic | ListSvcs / AddSvc |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_svc.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.edit_service_dialog.png |
| Mockup HTML | ✅ | mockups/EditSvc.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| svc | QString | Nazwa serwisu (z ListSvcs/AddSvc) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| svc_name_edit | QLineEdit | &Service Name: | Wyświetla nazwę serwisu (readOnly) | - |
| svc_description_edit | QLineEdit | Service &Description: | Opis serwisu (max 255) | - |
| svc_program_code_edit | QLineEdit | &Program Code: | Kod programowy (max 255) | - |
| svc_name_template_edit | QLineEdit | Log Name &Template: | Szablon nazwy logu (max 255, no spaces) | - |
| svc_description_template_edit | QLineEdit | Log &Description Template: | Szablon opisu logu (max 255) | - |
| svc_sub_event_inheritance_box | QComboBox | Inline Event Start/Length: | "From Relative Position" / "From Scheduler File" | textChangedData() |
| svc_voice_group_box | QComboBox | Voicetrack Group: | [none] + grupy z DB | - |
| svc_autospot_group_box | QComboBox | AutoSpot Group: | [none] + grupy z DB | - |
| svc_chain_box | QCheckBox | Insert CHAIN TO at log end | Toggle chain-to | - |
| svc_autorefresh_box | QCheckBox | Enable AutoRefresh By Default | Toggle auto-refresh | - |
| (autofill button) | QPushButton | Configure \n&Autofill Carts | Otwiera AutofillCarts dialog | autofillData() |
| (enable hosts button) | QPushButton | Enable &Hosts | Otwiera EditSvcPerms dialog | enableHostsData() |
| svc_loglife_box | QCheckBox | Set Logs to auto-delete | Włącza auto-usuwanie logów | toggles svc_loglife_spin |
| svc_loglife_spin | QSpinBox | (days) | Ilość dni (0-365) | - |
| svc_loglifeorigin_box | QComboBox | (after) | "air date" / "creation" | - |
| svc_shelflife_box | QCheckBox | Purge ELR Data | Włącza czyszczenie ELR | toggles svc_shelflife_spin |
| svc_shelflife_spin | QSpinBox | (days after airing) | Ilość dni (0-365) | - |
| svc_import_markers_check | QCheckBox | Include Import Markers in Finished Logs | Toggle import markers | - |
| svc_tfc_path_edit | QLineEdit | Import Path: | Ścieżka importu ruchu (max 191) | textChangedData() |
| svc_tfc_preimport_cmd_edit | QLineEdit | Preimport Command: | Komenda pre-import ruchu | textChangedData() |
| svc_tfc_label_cart_edit | QLineEdit | Insert Marker String: | String markera ruchu (max 32) | textChangedData() |
| svc_tfc_track_edit | QLineEdit | Insert Voice Track String: | String voice track ruchu (max 32) | textChangedData() |
| svc_tfc_import_template_box | QComboBox | Import Template: | [custom] + szablony z DB | tfcTemplateActivatedData() |
| svc_tfc_fields | ImportFields | (embedded widget) | Pola parsera ruchu (Offset/Length) | - |
| (tfc test button) | QPushButton | Test \n&Traffic | Otwiera TestImport (Traffic) | trafficData() |
| svc_tfc_copy_button | QPushButton | Copy To\nCustom | Kopiuje template do custom | trafficCopyData() |
| svc_mus_path_edit | QLineEdit | Import Path: | Ścieżka importu muzyki (max 191) | textChangedData() |
| svc_mus_preimport_cmd_edit | QLineEdit | Preimport Command: | Komenda pre-import muzyki | textChangedData() |
| svc_mus_label_cart_edit | QLineEdit | Insert Marker String: | String markera muzyki (max 32) | textChangedData() |
| svc_mus_track_edit | QLineEdit | Insert Voice Track String: | String voice track muzyki (max 255) | textChangedData() |
| svc_mus_break_edit | QLineEdit | Insert Traffic Break String: | String przerwy reklamowej (max 255) | textChangedData() |
| svc_mus_import_template_box | QComboBox | Import Template: | [custom] + szablony z DB | musTemplateActivatedData() |
| svc_mus_fields | ImportFields | (embedded widget) | Pola parsera muzyki (Offset/Length) | - |
| (mus test button) | QPushButton | Test \n&Music | Otwiera TestImport (Music) | musicData() |
| svc_mus_copy_button | QPushButton | Copy To\nCustom | Kopiuje template do custom | musicCopyData() |
| (ok button) | QPushButton | &OK | Zapisuje i zamyka (done(0)) | okData() |
| (cancel button) | QPushButton | &Cancel | Zamyka bez zapisu (done(-1)) | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | Po otwarciu | Wszystkie pola wypełnione z DB | svc_name_edit readOnly |
| Template != [custom] | Template wybrany | ImportFields disabled, Copy To Custom enabled | svc_tfc_fields/svc_mus_fields disabled |
| Template == [custom] | [custom] wybrany | ImportFields enabled, Copy To Custom disabled | svc_tfc_copy_button/svc_mus_copy_button disabled |
| Log auto-delete off | svc_loglife_box unchecked | Spin i origin disabled | svc_loglife_spin, svc_loglifeorigin_box, svc_loglifeorigin_label disabled |
| ELR purge off | svc_shelflife_box unchecked | Spin disabled | svc_shelflife_spin disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Copy Traffic | Potwierdzenie | "This action will overwrite your existing [custom] Traffic Data Import settings. Continue?" | trafficCopyData() | QMessageBox::question |
| Copy Music | Potwierdzenie | "This action will overwrite your existing [custom] Music Data Import settings. Continue?" | musicCopyData() | QMessageBox::question |
| Test import | Zapis wymagany | "Before testing, the import configuration\nmust be saved. Save now?" | trafficData()/musicData() gdy zmienione | QMessageBox::question |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListSvcs/AddSvc → EditSvc | Klik "Edit"/double-click/po create | QString svc (nazwa serwisu) |
| EditSvc → AutofillCarts | Klik "Configure Autofill Carts" | RDSvc *svc_svc |
| EditSvc → EditSvcPerms | Klik "Enable Hosts" | RDSvc *svc_svc |
| EditSvc → TestImport | Klik "Test Traffic"/"Test Music" | RDSvc *svc_svc, RDSvc::ImportSource |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | Screenshot niskiej rozdzielczości | Zgodne z kodem | Layout statyczny, sizeHint=870x691 |
