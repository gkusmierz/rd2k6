---
partial_id: "070"
artifact: ADM
window_name: "Feed Editor"
class_name: EditFeed
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditFeed.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Feed Editor

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditFeed |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Feed: {keyname} |
| Modalność | non-modal (brak setModal) |
| Rodzic | ListFeeds |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_feed.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditFeed.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| feed | QString (key name) | ListFeeds | tak |

## Widgety i interakcje

### Nagłówek (top)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_is_superfeed_box | QComboBox | Is Superfeed: (No/Yes) | przełącza tryb superfeed | superfeedActivatedData() |
| feed_is_superfeed_button | QPushButton | Select Member Feeds | otwiera EditSuperfeed | selectSubfeedsData() |
| feed_list_images_button | QPushButton | Manage Images | otwiera ListImages | listImagesData() |

### Channel Values (lewa strona, GroupBox)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_channel_title_edit | QLineEdit | Title: | tytuł kanału (max 191) | - |
| feed_channel_category_box | RDRssCategoryBox | Category: | kategoria RSS | - |
| feed_channel_link_edit | QLineEdit | Link: | link kanału (max 191) | - |
| feed_channel_copyright_edit | QLineEdit | Copyright: | copyright (max 64) | - |
| feed_channel_editor_edit | QLineEdit | Editor: | edytor (max 64) | - |
| feed_channel_author_edit | QLineEdit | Author: | autor (max 64) | - |
| feed_channel_author_is_default_check | QCheckBox | Use as default Item Author | domyślny autor itema | - |
| feed_channel_owner_name_edit | QLineEdit | Owner Name: | właściciel (max 64) | - |
| feed_channel_owner_email_edit | QLineEdit | Owner E-Mail: | email właściciela (max 64) | - |
| feed_channel_webmaster_edit | QLineEdit | Webmaster: | webmaster (max 64) | - |
| feed_channel_language_edit | QLineEdit | Language: | język (max 8) | - |
| feed_channel_explicit_check | QCheckBox | Channel contains explicit content | oznaczenie explicit | - |
| feed_channel_description_edit | QTextEdit | Description: | opis kanału (multiline) | - |
| feed_channel_image_box | RDImagePickerBox | Image: | obraz kanału | - |

### Upload / Audio (lewa strona, poniżej groupbox)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_purge_url_edit | QLineEdit | Upload URL: | URL uploadu (max 191) | purgeUrlChangedData() |
| feed_purge_username_edit | QLineEdit | Username: | username (max 64) | lineeditChangedData() |
| feed_purge_password_edit | QLineEdit (Password) | Password: | hasło (max 64) | - |
| feed_purge_use_id_file_check | QCheckBox | Authenticate with local identity file | użyj SSH id file | - |
| feed_format_edit | QLineEdit (readOnly) | Audio Format: | opis formatu audio | - |
| feed_format_button | QPushButton | S&et | otwiera RDExportSettingsDialog | setFormatData() |
| feed_normalize_check | QCheckBox | Normalize | włącz normalizację | checkboxToggledData() |
| feed_normalize_spin | QSpinBox | Level: | poziom normalizacji (-30..-1 dBFS) | - |
| feed_extension_edit | QLineEdit | Audio Extension: | rozszerzenie pliku (max 16) | - |
| feed_base_url_edit | QLineEdit | Download URL: | bazowy URL downloadu (max 191) | - |
| feed_autopost_box | QComboBox | Enable AutoPost: (No/Yes) | autopost | - |
| feed_max_shelf_life_spin | QSpinBox | Default Shelf Life: | czas życia (0-365 dni, 0=Unlimited) | - |
| feed_item_image_box | RDImagePickerBox | Default Item Image: | domyślny obraz itema | - |
| feed_base_preamble_edit | QLineEdit | Enclosure Preamble: | preambuła enclosure (max 191) | - |
| feed_castorder_box | QComboBox | Episode Sort Order: | Descending / Ascending | - |

### RSS Schema (prawa strona)
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_rss_schema_box | QComboBox | RSS Schema: | wybór schematu RSS | schemaActivatedData() |
| feed_header_xml_edit | QTextEdit | Header XML: | XML nagłówka | - |
| feed_header_xml_button | QPushButton | Copy to Clipboard | kopiuje header XML | copyHeaderXmlData() |
| feed_channel_xml_edit | QTextEdit | Channel XML: | XML kanału | - |
| feed_channel_xml_button | QPushButton | Copy to Clipboard | kopiuje channel XML | copyChannelXmlData() |
| feed_item_xml_edit | QTextEdit | Item XML: | XML itema | - |
| feed_item_xml_button | QPushButton | Copy to Clipboard | kopiuje item XML | copyItemXmlData() |

### Przyciski
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| feed_ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| feed_cancel_button | QPushButton | &Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Superfeed=Yes | is_superfeed=1 | Select Member Feeds enabled; shelf life, autopost, format, normalize, extension, item XML disabled | Wiele pól disabled |
| Superfeed=No | is_superfeed=0 | Select Member Feeds disabled; pola audio enabled | Member Feeds button disabled |
| Custom Schema | RSS schema=Custom | Header/Channel/Item XML editable | - |
| Non-custom Schema | RSS schema != Custom | Header/Channel XML read-only, Item XML disabled gdy superfeed | XML fields disabled |
| Normalize off | normalize unchecked | Level spin + label + unit disabled | Level disabled |
| SFTP URL + SSH key | Upload URL scheme=sftp i SSH id file istnieje | Checkbox SSH id file enabled | - |
| Empty username | purge username empty | Password disabled | Password disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Superfeed subfeeds | Superfeed musi mieć >= 1 subfeed | "Superfeed must have at least one subfeed assigned!" | OK, superfeed bez subfeedów | QMessageBox::warning |
| Upload URL | Schemat URL musi być obsługiwany | "Audio Upload URL has unsupported scheme!" | OK, nieobsługiwany schemat | QMessageBox::warning |
| Post XML | postXmlConditional() musi się powieść | (wewnętrzny dialog) | OK, błąd postowania | postXmlConditional |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListFeeds | addData() / editData() | feed keyname |
| EditFeed → EditSuperfeed | Select Member Feeds | RDFeed* |
| EditFeed → ListImages | Manage Images | RDImagePickerModel*, RDFeed* |
| EditFeed → RDExportSettingsDialog | Set (format) | RDSettings* |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
