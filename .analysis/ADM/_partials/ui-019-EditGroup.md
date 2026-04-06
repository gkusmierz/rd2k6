---
partial_id: "019"
artifact: ADM
window_name: "RDAdmin - Group: {groupname}"
class_name: EditGroup
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.group_dialog.png
mockup: mockups/EditGroup.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit Group

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditGroup |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Group: {groupname} |
| Modalność | modal |
| Rodzic | ListGroups / AddGroup |
| Rozmiar | 500x524 (resizable, minimum) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_group.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.group_dialog.png |
| Mockup HTML | ✅ | mockups/EditGroup.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| group | QString (group name) | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| group_name_edit | QLineEdit | &Group Name: | readonly, maxLength=10 | - |
| group_description_edit | QLineEdit | Group &Description: | edycja, maxLength=255 | - |
| group_title_edit | QLineEdit | Default Import &Title: | edycja, maxLength=255 | - |
| group_notify_email_addrs_edit | QLineEdit | Notification E-Mail Addresses: | edycja | - |
| group_carttype_box | QComboBox | Default Cart &Type: | Audio / Macro | - |
| group_lowcart_box | QSpinBox | Default Cart Number: | 0-999999, special="None" | lowCartChangedData(int) |
| group_highcart_box | QSpinBox | to | 1-999999 | - |
| group_enforcerange_box | QCheckBox | Enforce Cart Range | - | - |
| group_traffic_check | QCheckBox | Include this group in Traffic reports | - | - |
| group_music_check | QCheckBox | Include this group in Music reports | - | - |
| group_cutlife_check | QCheckBox | Set End Date/Time to | toggle spin | cutLifeEnabledData(bool) |
| group_cutlife_spin | QSpinBox | (days) | 0-999 | - |
| group_shelflife_check | QCheckBox | Purge expired cuts after | toggle spin | purgeEnabledData(bool) |
| group_shelflife_spin | QSpinBox | (days) | 0-30 | - |
| group_delete_carts_check | QCheckBox | Delete cart if empty | - | - |
| group_nownext_check | QCheckBox | Transmit Now & Next data | - | - |
| group_svcs_sel | RDListSelector | Available Services / Active Services | przenoszenie serwisów | - |
| group_color_button | QPushButton | C&olor | otwiera QColorDialog | colorData() |
| group_ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| group_cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Low cart = 0 | domyślnie brak zakresu | high cart disabled, enforce range disabled | group_highcart_box, group_enforcerange_box |
| Low cart > 0 | ustawiony zakres | high cart enabled (min=low), enforce range enabled | - |
| Cut life unchecked | domyślnie | spin days disabled | group_cutlife_spin |
| Cut life checked | user włączył | spin days enabled | - |
| Shelf life unchecked | domyślnie | spin days disabled, delete carts disabled | group_shelflife_spin, group_delete_carts_check |
| Shelf life checked | user włączył | spin days enabled, delete carts enabled | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| cart range | konflikt z innymi grupami | "The selected cart range conflicts with the following groups:...\nDo you still want to save?" | okData (CheckRange) | QMessageBox::warning Yes/No |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListGroups / AddGroup | edit / double-click / po dodaniu | group name |
| EditGroup → QColorDialog | przycisk Color | current color |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Screenshot odpowiada kodowi |
