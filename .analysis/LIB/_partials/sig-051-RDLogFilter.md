---
partial_id: 51
class_name: RDLogFilter
artifact: LIB
phase: 4
status: done
---

# Call Graph: RDLogFilter

## Sygnały emitowane (klasa jako nadawca)

| Sygnał | Emitowany w metodzie | Warunek | Znaczenie zdarzenia |
|--------|----------------------|---------|---------------------|
| `filterChanged(const QString &where_sql)` | `filterChangedData(const QString &)` (slot) | Tekst w polu filtra się zmienił | Nowy SQL WHERE clause gotowy dla konsumenta |
| `filterChanged(const QString &where_sql)` | `filterChangedData()` (slot — bez arg) | Kliknięcie checkboxa "Recent" | Nowy SQL WHERE clause gotowy dla konsumenta |
| `filterChanged(const QString &where_sql)` | `filterClearedData()` (slot) | Kliknięcie przycisku "Clear" | Filtr wyczyszczony, pusty WHERE clause |
| `filterChanged(const QString &where_sql)` | `serviceChangedData(int)` (slot) | Zmiana serwisu w comboboxie | Nowy SQL WHERE clause z nowym serwisem |

## Połączenia przychodzące (klasa jako odbiorca)

| Nadawca | Sygnał | Slot (tu) | Gdzie zdefiniowane connect() |
|---------|--------|-----------|------------------------------|
| `filter_service_box` (QComboBox) | `activated(int)` | `serviceChangedData(int)` | `lib/rdlogfilter.cpp:75` |
| `filter_filter_edit` (QLineEdit) | `textChanged(const QString &)` | `filterChangedData(const QString &)` | `lib/rdlogfilter.cpp:87` |
| `filter_clear_button` (QPushButton) | `clicked()` | `filterClearedData()` | `lib/rdlogfilter.cpp:89` |
| `filter_recent_check` (QCheckBox) | `clicked()` | `filterChangedData()` | `lib/rdlogfilter.cpp:98` |

## Połączenia wychodzące (klasa jako nadawca connect)

| Sygnał (tu) | Odbiorca | Slot odbiorcy | Gdzie zdefiniowane connect() |
|-------------|----------|---------------|------------------------------|
| `filterChanged(const QString &)` | `lib/rdlist_logs` (list_filter_widget) | `filterChangedData(const QString &)` | `lib/rdlist_logs.cpp:43` |
| `filterChanged(const QString &)` | `rdlogedit/rdlogedit` (log_filter_widget) | `filterChangedData(const QString &)` | `rdlogedit/rdlogedit.cpp:126` |
| `filterChanged(const QString &)` | `rdairplay/list_logs` (list_filter_widget) | `filterChangedData(const QString &)` | `rdairplay/list_logs.cpp:48` |

## Q_PROPERTY reactive bindings

(none — Qt4 project)

## Cross-artifact sygnały (TCP/IPC)

| Mechanizm | Cel | Sygnał/Metoda | Znaczenie |
|-----------|-----|---------------|-----------|
| (brak) | — | — | — |
