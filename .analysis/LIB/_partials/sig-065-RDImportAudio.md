---
partial_id: 065
class_name: RDImportAudio
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDImportAudio

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|---------------------|---------|---------------------|
| (brak publicznych sygnałów) | — | — | Dialog modalny — wynik przekazywany przez `exec()` i parametry przez wskaźniki |

## Połączenia przychodzące (klasa jako odbiorca — wewnętrzne)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `import_mode_group` (QButtonGroup) | `buttonClicked(int)` | `modeClickedData(int)` | `lib/rdimport_audio.cpp:75-76` |
| `import_in_filename_edit` (QLineEdit) | `textChanged(const QString &)` | `filenameChangedData(const QString &)` | `lib/rdimport_audio.cpp:92-93` |
| `import_in_selector_button` (QPushButton) | `clicked()` | `selectInputFileData()` | `lib/rdimport_audio.cpp:105-106` |
| `import_autotrim_box` (QCheckBox) | `toggled(bool)` | `autotrimCheckData(bool)` | `lib/rdimport_audio.cpp:134-135` |
| `import_out_filename_edit` (QLineEdit) | `textChanged(const QString &)` | `filenameChangedData(const QString &)` | `lib/rdimport_audio.cpp:165-166` |
| `import_out_selector_button` (QPushButton) | `clicked()` | `selectOutputFileData()` | `lib/rdimport_audio.cpp:179-180` |
| `import_out_format_button` (QPushButton) | `clicked()` | `selectOutputFormatData()` | `lib/rdimport_audio.cpp:207-208` |
| `import_normalize_box` (QCheckBox) | `toggled(bool)` | `normalizeCheckData(bool)` | `lib/rdimport_audio.cpp:223-224` |
| `import_import_button` (QPushButton) | `clicked()` | `importData()` | `lib/rdimport_audio.cpp:248` |
| `import_cancel_button` (QPushButton) | `clicked()` | `cancelData()` | `lib/rdimport_audio.cpp:258` |

## Połączenia wychodzące (klasa jako nadawca connect)

(brak — dialog nie emituje sygnałów do zewnętrznych odbiorców)

## Mechanizm przekazywania wyników

| Wynik | Mechanizm | Opis |
|-------|-----------|------|
| Zaimportowany plik audio | `done(0)` / `exec()` return value | Wynik 0 = sukces, -1 = anulowanie |
| Ścieżka pliku | Wskaźnik `QString *path` | Modyfikowany bezpośrednio przez dialog |
| Metadane | Wskaźnik `bool *import_metadata` | Flaga czy metadane zostały załadowane |
| Dane wave | Wskaźnik `RDWaveData *wavedata` | Wypełniany metadanymi pliku źródłowego |

## Wywołujący (zewnętrzni użytkownicy)

| Plik | Metoda | Kontekst |
|------|--------|---------|
| `rdlibrary/audio_cart.cpp:605` | `importCutData()` | Import audio do cart/cut z biblioteki RDLibrary |
| `rdlogedit/voice_tracker.cpp:2375` | (voice tracker) | Import nagrania do voice track |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| RDAudioImport | CAE daemon | Wewnętrzne przez RDCae | Konwersja i zapis audio do magazynu Rivendell |
| RDAudioExport | CAE daemon | Wewnętrzne przez RDCae | Export audio z magazynu Rivendell do pliku |
