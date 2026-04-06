---
partial_id: "073"
artifact: ADM
window_name: "Image Viewer"
class_name: EditImage
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/EditImage.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Image Viewer

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditImage |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Image Viewer |
| Modalność | non-modal (brak setModal) |
| Rodzic | ListImages |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_image.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/EditImage.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| img_id | int | ListImages (via exec()) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| c_image_label | QLabel | (wyświetla obraz skalowany do okna) | podgląd obrazu | - |
| c_description_edit | QLineEdit | Description: | opis obrazu (max 191, edytowalny) | - |
| c_url_edit | QLineEdit (readOnly) | URL: | URL obrazu (autogenerowany) | - |
| c_size_value_label | QLabel | Native Size: | wymiary obrazu WxH | - |
| c_extension_value_label | QLabel | Type: | rozszerzenie pliku (uppercase) | - |
| c_ok_button | QPushButton | OK | zapisuje opis i zamyka | okData() |
| c_cancel_button | QPushButton | Cancel | zamyka bez zapisu | cancelData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Domyślny | exec(img_id) | Obraz wyświetlony skalowany, metadane wypełnione z DB | - |
| Resize | zmiana rozmiaru okna | Obraz przeskalowany do nowego rozmiaru (KeepAspectRatio) | - |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | - | - | - | Brak walidacji - description zawsze poprawny |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListImages | addData() (po imporcie), viewData(), double-click | img_id |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
