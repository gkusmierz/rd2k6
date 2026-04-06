---
partial_id: "072"
artifact: ADM
window_name: "Image Manager"
class_name: ListImages
ui_source: code
ui_file: null
screenshot: null
mockup: mockups/ListImages.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Image Manager

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | ListImages |
| Typ | Dialog |
| Tytuł okna | RDAdmin - Image Manager |
| Modalność | non-modal (brak setModal) |
| Rodzic | EditFeed |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/list_images.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ❌ | brak |
| Mockup HTML | ✅ | mockups/ListImages.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| model | RDImagePickerModel* | EditFeed | tak |
| feed | RDFeed* | EditFeed (via exec()) | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| list_view | QListView | (model: RDImagePickerModel, 40x40 thumbnails) | wyświetla listę obrazów | clicked→clickedData(), doubleClicked→doubleClickedData() |
| list_add_button | QPushButton | Add | otwiera QFileDialog, importuje i uploaduje obraz | addData() |
| list_view_button | QPushButton | View | otwiera EditImage | viewData() |
| list_delete_button | QPushButton | Delete | usuwa wybrany obraz | deleteData() |
| list_close_button | QPushButton | Close | zamyka dialog | closeData() |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Brak selekcji | nic nie wybrane | View i Delete reagują na kliknięcie | View/Delete stany zależą od kliknięcia |
| Obraz wybrany | kliknięcie na element z DecorationRole | View i Delete enabled | - |
| Pusta pozycja | kliknięcie na element bez DecorationRole | View i Delete disabled | View/Delete disabled |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| Import pliku | importImageFile() musi się powieść | "Image import failed." + err_msg | Add, błąd importu | QMessageBox::warning |
| Upload obrazu | postImage() musi się powieść | "Image upload failed!" | Add, błąd uploadu | QMessageBox::warning |
| Usunięcie - in use | Obraz nie może być używany jako channel/default/item image | "Image is in use as {roles}." | Delete, obraz w użyciu | QMessageBox::warning |
| Usunięcie - potwierdzenie | Potwierdzenie usunięcia | "Are you sure you want to delete this image?" | Delete | QMessageBox::question |
| Usunięcie - błąd | deleteImage() musi się powieść | "Image deletion failed!" + err_msg | Delete, błąd usunięcia | QMessageBox::warning |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| EditFeed | Manage Images | RDImagePickerModel*, RDFeed* |
| ListImages → EditImage | Add (po imporcie) / View / Double-click | img_id |
| ListImages → QFileDialog | Add | filtr: RD_PODCAST_IMAGE_FILE_FILTER |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| N/A | brak screenshota | - | - |
