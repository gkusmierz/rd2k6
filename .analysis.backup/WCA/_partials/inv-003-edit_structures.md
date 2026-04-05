---
partial_id: "003"
artifact: WCA
class_name: Edit/Save structures (API input DTOs)
header_file: rd_editcart.h, rd_editcut.h, rd_savelog.h, rd_import.h, rd_createticket.h, rd_listsystemsettings.h, rd_audioinfo.h, rd_audiostore.h, rd_trimaudio.h, rd_listlog.h, rd_listlogs.h, rd_listservices.h
source_file: null
phase: 2
status: done
agent_version: 1.1.0
---

# Dodatkowe struktury danych (API input/output DTOs)

## Typ
Pure C struct definitions. Uzywane jako parametry wejsciowe (edit/save) lub struktury wyjsciowe (info/response) dla funkcji API.

---

### struct edit_cart_values (rd_editcart.h)

Struktura "optional fields" do edycji metadanych koszyka. Kazde pole ma towarzyszacy flag `use_*` (int, bool) -- wartosc pola jest wysylana tylko gdy use_* = 1 (wzorzec "partial update").

Pola: grp_name, title, artist, album, year, label, client, agency, publisher, composer, conductor, user_defined, usage_code, forced_length, enforce_length, asyncronous, owner, notes (18 pol + 18 flag use_*).

---

### struct edit_cut_values (rd_editcut.h)

Struktura "optional fields" do edycji metadanych cuta. Ten sam wzorzec use_* co edit_cart_values.

Pola: evergreen, description, outcue, isrc, isci, start_datetime, end_datetime, sun-sat (7 dni), start_daypart, end_daypart, weight, validity, coding_format, sample_rate, bit_rate, channels, play_gain, start_point, end_point, fadeup_point, fadedown_point, segue_start_point, segue_end_point, segue_gain, hook_start_point, hook_end_point, talk_start_point, talk_end_point (29 pol + 29 flag use_*).

---

### struct save_loghdr_values (rd_savelog.h)

Naglowek logu do zapisu -- metadane calego logu.

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| loghdr_service[41] | char[] | Nazwa serwisu |
| loghdr_description[257] | char[] | Opis logu |
| loghdr_autorefresh | int | Auto-refresh (bool) |
| loghdr_purge_date | struct tm | Data wygasniecia |
| loghdr_start_date | struct tm | Data poczatku waznosci |
| loghdr_end_date | struct tm | Data konca waznosci |

---

### struct save_logline_values (rd_savelog.h)

Pojedyncza linia logu do zapisu -- pelna specyfikacja elementu playlisty.

Pola: id, type, source, cart_number, starttime, gracetime, time_type, transition_type, start_point_log, end_point_log, segue_start_point_log, segue_end_point_log, fadeup_point_log, fadeup_gain, fadedown_point_log, fadedown_gain, duckup_gain, duckdown_gain, marker_comment, marker_label, origin_user, origin_datetime, event_length, link_event_name, link_starttime, link_length, link_start_slop, link_end_slop, link_id, link_embedded, ext_starttime, ext_length, ext_cart_name, ext_data, ext_event_id, ext_annc_type (36 pol).

---

### struct rd_logline (rd_listlog.h)

Linia logu odczytana z serwera -- odpowiednik save_logline_values ale z pelniejszymi metadanymi (wlaczajac metadane koszyka/cuta).

Pola: line, id, type, cart_type, cart_number, cut_number, group_name, group_color, title, artist, album, year, label, client, agency, publisher, composer, conductor, user_defined, usage_code, enforce_length, forced_length, evergreen, source, time_type, starttime, transition_type, cut_quantity, last_cut_played, marker_comment, marker_label, origin_user, origin_datetime, start_point_cart/log, end_point_cart/log, segue_start_point_cart/log, segue_end_point_cart/log, segue_gain, fadeup_point_cart/log, fadeup_gain, fadedown_point_cart/log, fadedown_gain, duckup_gain, duckdown_gain, talk_start_point, talk_end_point, hook_mode, hook_start_point, hook_end_point, event_length, link_event_name, link_starttime, link_start_slop, link_end_slop, link_id, link_embedded, ext_starttime, ext_length, ext_cart_name, ext_data, ext_event_id, ext_annc_type (62 pola).

---

### struct rd_log (rd_listlogs.h)

Metadane logu.

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| log_name[257] | char[] | Nazwa logu |
| log_service[41] | char[] | Przypisany serwis |
| log_description[257] | char[] | Opis |
| log_origin_username[1021] | char[] | Tworca logu |
| log_origin_datetime | struct tm | Data utworzenia |
| log_purge_date | struct tm | Data wygasniecia |
| log_link_datetime | struct tm | Data linkowania |
| log_modified_datetime | struct tm | Data modyfikacji |
| log_autorefresh | int | Auto-refresh (bool) |
| log_startdate / log_enddate | struct tm | Okno waznosci |
| log_scheduled_tracks | int | Zaplanowane traki |
| log_completed_tracks | int | Ukonczone traki |
| log_music_links / log_music_linked | int | Linki muzyczne |
| log_traffic_links / log_traffic_linked | int | Linki traffic |

---

### struct rd_service (rd_listservices.h)

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| service_name[41] | char[] | Nazwa serwisu radiowego |
| service_description[1021] | char[] | Opis serwisu |

---

### struct rd_audioinfo (rd_audioinfo.h)

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| cart_number | unsigned | Numer koszyka |
| cut_number | unsigned | Numer cuta |
| format | int | Format audio |
| channels | int | Liczba kanalow |
| samplerate | int | Czestotliwosc probkowania |
| frames | unsigned | Liczba ramek |
| length | unsigned | Dlugosc (ms) |

---

### struct rd_audiostore (rd_audiostore.h)

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| freebytes | long unsigned | Wolne bajty w magazynie audio |
| totalbytes | long unsigned | Calkowite bajty w magazynie audio |

---

### struct rd_trimaudio (rd_trimaudio.h)

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| cart_number | unsigned | Numer koszyka |
| cut_number | unsigned | Numer cuta |
| trimlevel | int | Poziom trim (dB) |
| starttrimpoint | int | Wyznaczony punkt startu (ms) |
| endtrimpoint | int | Wyznaczony punkt konca (ms) |

---

### struct rd_ticketinfo (rd_createticket.h)

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| ticket[41] | char[] | Token biletu autentykacji |
| tkt_expiration_datetime | struct tm | Data wygasniecia biletu |

---

### struct rd_cartimport (rd_import.h)

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| response_code | int | Kod odpowiedzi HTTP |
| error_string[256] | char[] | Komunikat bledu |
| cart_number | unsigned | Numer koszyka (wynikowy) |
| cut_number | unsigned | Numer cuta (wynikowy) |

---

### struct rd_system_settings (rd_listsystemsettings.h)

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| sample_rate | unsigned | Systemowa czestotliwosc probkowania |
| dup_cart_titles | int | Zezwalaj na duplikaty tytulow (bool) |
| max_post_length | unsigned | Maksymalny rozmiar POST (bajty) |
| isci_xreference_path[1021] | char[] | Sciezka do pliku ISCI cross-reference |
| temp_cart_group[41] | char[] | Grupa tymczasowa dla koszykow |
