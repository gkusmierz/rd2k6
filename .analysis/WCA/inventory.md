---
phase: 2
artifact: WCA
artifact_name: librivwebcapi
status: done
completed_at: 2026-04-05
partial_count: 4
conflicts_found: 0
missing_coverage: 0
agent_version: 1.1.0
---

# Inventory: librivwebcapi

## UWAGA: Pure C Library

librivwebcapi jest biblioteka napisana w czystym C (nie C++/Qt). Nie zawiera klas, sygnalow,
slotow, Q_PROPERTY ani QObject. Inventory jest dostosowany do C API: opisuje struktury danych,
funkcje API i utility functions zamiast klas Qt.

## Statystyki

| Typ | Liczba |
|-----|--------|
| Struktury danych (struct) | 15 |
| Funkcje API (publiczne) | 45 |
| Funkcje pomocnicze (internal) | 6 |
| Funkcje utility (rd_common) | 8 |
| Enum types | 1 |
| Pliki .h | 49 |
| Pliki .c | 45 |
| Makra kompilacji | 3 |

---

## Architektura biblioteki

### Wzorzec komunikacji

Wszystkie funkcje API (oprocz RD_GetVersion, RD_GetUserAgent) realizuja ten sam wzorzec:

1. **HTTP POST** do `http://{hostname}/rd-bin/rdxport.cgi` via libcurl
2. **XML parsing** odpowiedzi via libexpat (SAX-style: ElementStart/ElementData/ElementEnd callbacks)
3. **Alokacja dynamiczna** struktur wynikowych (realloc w callbackach XML)
4. **Autentykacja**: kazde wywolanie wymaga (hostname, username, passwd, ticket, user_agent)
   - Mozna uzywac username+passwd LUB ticket (token z RD_CreateTicket)
   - user_agent opcjonalny -- jesli pusty, ustawiany na "rivwebcapi/{VERSION}"

### Konwencja zwracania bledow

| Wartosc zwrotna | Znaczenie |
|-----------------|-----------|
| 0 | Sukces (HTTP 2xx) |
| -1 | Blad libcurl (polaczenie, timeout, DNS) |
| 200-599 | Kod HTTP bledu serwera (np. 401=unauthorized, 404=not found) |

### Konwencja parametrow wyjsciowych

Funkcje zwracajace dane uzywaja wzorca:
```c
int RD_Xxx(struct rd_yyy *result[], ..., unsigned *numrecs);
```
- `result` -- wskaznik do wskaznika tablicy (alokowanej dynamicznie przez funkcje)
- `numrecs` -- liczba rekordow zwroconych (inicjalizowany na 0 przed wywolaniem)
- Caller odpowiada za zwolnienie pamieci (free lub dedykowana funkcja _Free)

### Kompatybilnosc C++

Kazdy header publiczny jest opakowany w:
```c
_MYRIVLIB_INIT_DECL  // -> extern "C" { (w C++)
...deklaracje...
_MYRIVLIB_FINI_DECL  // -> } (w C++)
```

---

## Struktury danych -- domeny

### Struktury domenowe (header-only, brak .c)

#### struct rd_cart (rd_cart.h)

**Odpowiedzialnosc:** Reprezentuje koszyk audio -- podstawowa jednostke organizacji audio w Rivendell. Koszyk to kontener na jedno lub wiele nagran (cutow) z metadanymi muzycznymi/reklamowymi.

| Pole | Typ | Znaczenie biznesowe |
|------|-----|---------------------|
| cart_number | unsigned | Unikalny numer koszyka (identyfikator) |
| cart_type | unsigned | Typ: audio (1) lub macro (2) -- enum CART_TYPE |
| cart_grp_name[41] | char[] | Grupa organizacyjna |
| cart_title[1021] | char[] | Tytul |
| cart_artist[1021] | char[] | Artysta |
| cart_album[1021] | char[] | Album |
| cart_year | int | Rok wydania |
| cart_label[257] | char[] | Wytworna |
| cart_client[257] | char[] | Klient (spoty reklamowe) |
| cart_agency[257] | char[] | Agencja reklamowa |
| cart_publisher[257] | char[] | Wydawca |
| cart_composer[257] | char[] | Kompozytor |
| cart_conductor[257] | char[] | Dyrygent |
| cart_user_defined[1021] | char[] | Pole dowolne |
| cart_usage_code | int | Kod uzycia (kategoria) |
| cart_forced_length | int | Wymuszona dlugosc (ms) |
| cart_average_length | int | Srednia dlugosc (ms) |
| cart_length_deviation | int | Odchylenie dlugosci (ms) |
| cart_average_segue_length | int | Srednia dlugosc segue (ms) |
| cart_average_hook_length | int | Srednia dlugosc hooka (ms) |
| cart_last_cut_played | unsigned | Numer ostatnio odtworzonego cuta |
| cart_validity | unsigned | Status waznosci |
| cart_enforce_length | int | Wymuszenie dlugosci (bool) |
| cart_asyncronous | int | Tryb asynchroniczny (bool) |
| cart_owner[257] | char[] | Wlasciciel |
| cart_notes[4096] | char[] | Notatki |
| cart_metadata_datetime | struct tm | Data modyfikacji metadanych |
| cart_cut_quantity | unsigned | Liczba cutow |
| cart_cuts | struct rd_cut ** | Tablica cutow (dynamiczna, 1:N) |

**Enum CART_TYPE:** TYPE_ALL=0 (filtr), TYPE_AUDIO=1, TYPE_MACRO=2

---

#### struct rd_cut (rd_cut.h)

**Odpowiedzialnosc:** Reprezentuje element audio (cut) -- pojedynczy plik dzwiekowy w koszyku z pelnym zestawem punktow edycyjnych, daypartingiem i metadanymi playoutowymi.

| Pole | Typ | Znaczenie biznesowe |
|------|-----|---------------------|
| cut_name[41] | char[] | Unikalna nazwa (format NNNNNN_NNN) |
| cut_cart_number | unsigned | Koszyk-rodzic |
| cut_cut_number | unsigned | Numer cuta |
| cut_evergreen | int | Zawsze aktualny (bool) |
| cut_description[257] | char[] | Opis |
| cut_outcue[257] | char[] | Outcue (tekst konca dla operatora) |
| cut_isrc[49] | char[] | Kod ISRC |
| cut_isci[129] | char[] | Kod ISCI |
| cut_length | unsigned | Dlugosc audio (ms) |
| cut_origin_datetime | struct tm | Data nagrania/importu |
| cut_start_datetime | struct tm | Poczatek okna waznosci |
| cut_end_datetime | struct tm | Koniec okna waznosci |
| cut_sun..cut_sat | int (x7) | Dozwolone dni tygodnia (dayparting) |
| cut_start_daypart[15] | char[] | Poczatek daypartu |
| cut_end_daypart[15] | char[] | Koniec daypartu |
| cut_origin_name[257] | char[] | Zrodlo nagrania |
| cut_origin_login_name[1021] | char[] | Login nagrywajacego |
| cut_source_hostname[1021] | char[] | Hostname zrodla |
| cut_weight | unsigned | Waga rotacji |
| cut_last_play_datetime | struct tm | Ostatnie odtworzenie |
| cut_play_counter | unsigned | Licznik odtworzen (global) |
| cut_local_counter | unsigned | Licznik odtworzen (local) |
| cut_validity | unsigned | Status waznosci |
| cut_coding_format | unsigned | Format kodowania |
| cut_sample_rate | unsigned | Sample rate |
| cut_bit_rate | unsigned | Bitrate |
| cut_channels | unsigned | Kanaly |
| cut_play_gain | int | Gain odtwarzania (dB) |
| cut_start_point | int | Punkt startu (ms) |
| cut_end_point | int | Punkt konca (ms) |
| cut_fadeup_point | int | Fade-up (ms) |
| cut_fadedown_point | int | Fade-down (ms) |
| cut_segue_start_point | int | Segue start (ms) |
| cut_segue_end_point | int | Segue end (ms) |
| cut_segue_gain | int | Segue gain (dB) |
| cut_hook_start_point | int | Hook start (ms) -- fragment "chwytliwy" |
| cut_hook_end_point | int | Hook end (ms) |
| cut_talk_start_point | int | Talk-over start (ms) |
| cut_talk_end_point | int | Talk-over end (ms) |

---

#### struct rd_group (rd_group.h)

**Odpowiedzialnosc:** Grupa koszykow -- kategoria organizacyjna z zakresem numerow, domyslnymi ustawieniami i flagami raportowania.

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| grp_name[41] | char[] | Nazwa grupy (ID) |
| grp_desc[1021] | char[] | Opis |
| grp_default_cart_type | unsigned | Domyslny typ koszyka |
| grp_lo_limit / grp_hi_limit | unsigned | Zakres numerow koszykow |
| grp_shelf_life | int | Czas waznosci (dni) |
| grp_default_title[1021] | char[] | Domyslny tytul |
| grp_enforce_range | int | Wymuszenie zakresu (bool) |
| grp_report_tfc / grp_report_mus | int | Raportowanie traffic/muzyczne (bool) |
| grp_now_next | int | Now/Next (bool) |
| grp_color[8] | char[] | Kolor hex |

---

#### struct rd_schedcodes (rd_schedcodes.h)

**Odpowiedzialnosc:** Kod schedulera -- tag kategoryzacji koszykow uzywany w planowaniu ramowki.

| Pole | Typ | Znaczenie |
|------|-----|-----------|
| code[41] | char[] | Kod (ID) |
| description[1021] | char[] | Opis |

---

### Struktury API (definiowane w headerach funkcji)

#### struct edit_cart_values (rd_editcart.h)

**Odpowiedzialnosc:** Struktura parametrow do partial update metadanych koszyka. Kazde pole ma towarzyszacy flag use_* -- tylko pola z use_*=1 sa wysylane do serwera.

18 pol edytowalnych: grp_name, title, artist, album, year, label, client, agency, publisher, composer, conductor, user_defined, usage_code, forced_length, enforce_length, asyncronous, owner, notes.

---

#### struct edit_cut_values (rd_editcut.h)

**Odpowiedzialnosc:** Struktura parametrow do partial update metadanych cuta. Wzorzec use_* jak edit_cart_values.

29 pol edytowalnych: evergreen, description, outcue, isrc, isci, start/end_datetime, sun-sat (7 dni), start/end_daypart, weight, validity, coding_format, sample_rate, bit_rate, channels, play_gain, start/end_point, fadeup/fadedown_point, segue_start/end_point, segue_gain, hook_start/end_point, talk_start/end_point.

---

#### struct rd_logline (rd_listlog.h)

**Odpowiedzialnosc:** Linia logu playoutowego odczytana z serwera -- pelne metadane elementu playlisty wlaczajac dane koszyka/cuta.

62 pola: line, id, type, cart_type, cart_number, cut_number, group_name/color, metadane muzyczne (title..conductor), usage_code, enforce_length, forced_length, evergreen, source, time_type, starttime, transition_type, cut_quantity, last_cut_played, marker_comment/label, origin_user/datetime, punkty audio (start/end/segue/fade cart+log, gain, duck, talk, hook), event_length, link fields (6 pol), ext fields (5 pol).

---

#### struct rd_log (rd_listlogs.h)

**Odpowiedzialnosc:** Metadane logu playoutowego.

16 pol: name, service, description, origin_username/datetime, purge_date, link_datetime, modified_datetime, autorefresh, startdate/enddate, scheduled/completed_tracks, music_links/linked, traffic_links/linked.

---

#### struct save_loghdr_values (rd_savelog.h)

**Odpowiedzialnosc:** Naglowek logu do zapisu.

6 pol: service, description, autorefresh, purge_date, start_date, end_date.

---

#### struct save_logline_values (rd_savelog.h)

**Odpowiedzialnosc:** Linia logu do zapisu -- wszystkie parametry konfiguracyjne linii playlisty.

36 pol: id, type, source, cart_number, starttime, gracetime, time_type, transition_type, punkty audio (8 pol), gain (4 pol), marker_comment/label, origin_user/datetime, event_length, link fields (7 pol), ext fields (5 pol).

---

#### struct rd_service (rd_listservices.h)

**Odpowiedzialnosc:** Serwis radiowy (stacja/program).

2 pola: service_name[41], service_description[1021].

---

#### struct rd_audioinfo (rd_audioinfo.h)

**Odpowiedzialnosc:** Informacje techniczne o pliku audio cuta.

7 pol: cart_number, cut_number, format, channels, samplerate, frames, length.

---

#### struct rd_audiostore (rd_audiostore.h)

**Odpowiedzialnosc:** Stan magazynu audio (dysku).

2 pola: freebytes, totalbytes (long unsigned).

---

#### struct rd_trimaudio (rd_trimaudio.h)

**Odpowiedzialnosc:** Wynik operacji trim -- wyznaczone punkty start/end na zadanym poziomie dB.

5 pol: cart_number, cut_number, trimlevel, starttrimpoint, endtrimpoint.

---

#### struct rd_ticketinfo (rd_createticket.h)

**Odpowiedzialnosc:** Token autentykacji sesyjnej.

2 pola: ticket[41], tkt_expiration_datetime.

---

#### struct rd_cartimport (rd_import.h)

**Odpowiedzialnosc:** Wynik operacji importu audio.

4 pola: response_code, error_string[256], cart_number, cut_number.

---

#### struct rd_system_settings (rd_listsystemsettings.h)

**Odpowiedzialnosc:** Ustawienia systemowe Rivendell.

5 pol: sample_rate, dup_cart_titles, max_post_length, isci_xreference_path, temp_cart_group.

---

## Funkcje API -- szczegolowy inwentarz

### Zarzadzanie koszykami (Carts) -- 10 funkcji

| Funkcja | Plik .h/.c | Parametry specyficzne | Efekt | Zwraca |
|---------|-----------|----------------------|-------|--------|
| RD_AddCart | rd_addcart | group, type, cartnumber | Tworzy koszyk w grupie | rd_cart |
| RD_EditCart | rd_editcart | edit_cart_values, cartnum | Partial update metadanych koszyka | rd_cart |
| RD_RemoveCart | rd_removecart | cartnumber | Usuwa koszyk z cutami | status |
| RD_ListCart | rd_listcart | cartnumber | Pobiera koszyk po numerze | rd_cart |
| RD_ListCarts | rd_listcarts | group_name, filter, type | Listuje koszyki z filtrem | rd_cart[] |
| RD_ListCartCuts | rd_listcartcuts | cartnumber | Koszyk z cutami | rd_cart + rd_cut[] |
| RD_ListCartsCuts | rd_listcartscuts | group_name, filter, type | Wiele koszykow z cutami | rd_cart[] + rd_cut[][] |
| RD_ListCartSchedCodes | rd_listcartschedcodes | cartnum | Kody schedulera koszyka | rd_schedcodes[] |
| RD_AssignSchedCode | rd_assignschedcode | cartnum, code | Przypisuje kod schedulera | status |
| RD_UnassignSchedCode | rd_unassignschedcode | cartnum, code | Usuwa kod schedulera | status |

### Zarzadzanie cutami (Cuts) -- 5 funkcji

| Funkcja | Plik .h/.c | Parametry specyficzne | Efekt | Zwraca |
|---------|-----------|----------------------|-------|--------|
| RD_AddCut | rd_addcut | cartnumber | Dodaje cut do koszyka | rd_cut |
| RD_EditCut | rd_editcut | edit_cut_values, cartnum, cutnum | Partial update metadanych cuta | rd_cut |
| RD_RemoveCut | rd_removecut | cartnumber, cutnumber | Usuwa cut | status |
| RD_ListCut | rd_listcut | cartnumber, cutnumber | Pobiera cut | rd_cut |
| RD_ListCuts | rd_listcuts | cartnumber | Listuje cuty koszyka | rd_cut[] |

### Audio -- 8 funkcji

| Funkcja | Plik .h/.c | Parametry specyficzne | Efekt | Zwraca |
|---------|-----------|----------------------|-------|--------|
| RD_AudioInfo | rd_audioinfo | cartnumber, cutnumber | Info o pliku audio | rd_audioinfo |
| RD_AudioStore | rd_audiostore | (brak) | Stan magazynu audio | rd_audiostore |
| RD_ExportCart | rd_export | cartnum, cutnum, format, channels, sample_rate, bit_rate, quality, start/end_point, normalization, metadata, filename | Eksport z konwersja | status |
| RD_ImportCart | rd_import | cartnum, cutnum, channels, normalization, autotrim, metadata, create, group, title, filename | Import audio | rd_cartimport |
| RD_ExportPeaks | rd_exportpeaks | cartnum, cutnum, filename | Eksport waveform | status |
| RD_CopyAudio | rd_copyaudio | src_cart/cut, dest_cart/cut | Kopiuj audio | status |
| RD_DeleteAudio | rd_deleteaudio | cartnumber, cutnumber | Usun dane audio | status |
| RD_TrimAudio | rd_trimaudio | cartnumber, cutnumber, trimlevel | Wyznacz trim | rd_trimaudio |

### Logi -- 5 funkcji

| Funkcja | Plik .h/.c | Parametry specyficzne | Efekt | Zwraca |
|---------|-----------|----------------------|-------|--------|
| RD_AddLog | rd_addlog | logname, servicename | Tworzy log | status |
| RD_DeleteLog | rd_deletelog | logname | Usuwa log | status |
| RD_ListLog | rd_listlog | logname | Zawartosc logu | rd_logline[] |
| RD_ListLogs | rd_listlogs | servicename, logname, trackable, filter, recent | Listuje logi | rd_log[] |
| RD_SaveLog | rd_savelog | hdrvals, linevals[], linevals_quan, logname | Zapisuje caly log | status |

### Grupy i serwisy -- 5 funkcji

| Funkcja | Plik .h/.c | Parametry specyficzne | Efekt | Zwraca |
|---------|-----------|----------------------|-------|--------|
| RD_ListGroup | rd_listgroup | group | Jedna grupa | rd_group |
| RD_ListGroups | rd_listgroups | (brak) | Wszystkie grupy | rd_group[] |
| RD_ListServices | rd_listservices | trackable | Serwisy | rd_service[] |
| RD_ListSchedCodes | rd_listschedcodes | (brak) | Kody schedulera | rd_schedcodes[] |
| RD_ListSystemSettings | rd_listsystemsettings | (brak) | Ustawienia systemowe | rd_system_settings |

### Podcasting / RSS / Images -- 8 funkcji

| Funkcja | Plik .h/.c | Parametry specyficzne | Efekt | Zwraca |
|---------|-----------|----------------------|-------|--------|
| RD_PostPodcast | rd_postpodcast | cast_id | Publikuj audio podcastu | status |
| RD_SavePodcast | rd_savepodcast | cast_id, filename | Pobierz audio podcastu | status |
| RD_DeletePodcast | rd_deletepodcast | cast_id | Usun audio podcastu | status |
| RD_RemovePodcast | rd_removepodcast | cast_id | Usun item podcastu | status |
| RD_PostRss | rd_postrss | feed_id | Publikuj feed RSS | status |
| RD_RemoveRss | rd_removerss | feed_id | Usun feed RSS | status |
| RD_PostImage | rd_postimage | img_id | Publikuj obraz | status |
| RD_RemoveImage | rd_removeimage | img_id | Usun obraz | status |

### Autentykacja i metadane -- 3 funkcje

| Funkcja | Plik .h/.c | Parametry specyficzne | Efekt | Zwraca |
|---------|-----------|----------------------|-------|--------|
| RD_CreateTicket | rd_createticket | (brak dodatkowych) | Tworzy token sesji | rd_ticketinfo |
| RD_GetVersion | rd_getversion | (brak) | Wersja biblioteki (lokalna) | char* |
| RD_GetUserAgent | rd_getuseragent | (brak) | User-Agent string (lokalna) | char* |

### Utility (rd_common) -- 8 funkcji

| Funkcja | Efekt |
|---------|-------|
| RD_ReadBool | Parsuje "true"/"yes"/"on" -> 1 (case-insensitive) |
| RD_Cnv_DTString_to_tm | ISO 8601 datetime string -> struct tm (local time) |
| RD_Cnv_tm_to_DTString | struct tm -> datetime string z UTC offset |
| strlcpy | Bezpieczne kopiowanie stringow z null-termination |
| get_local_offset | Offset UTC lokalnej strefy (sekundy, double) |
| validate_tm | Walidacja struktury tm (zakres + leap year) |
| RD_Cnv_TString_to_msec | Time string "HH:MM:SS.Z" -> milisekundy od polnocy |
| RD_Cnv_msec_to_TString | Milisekundy od polnocy -> time string "HH:MM:SS.Z" |

### Funkcje pomocnicze (internal) -- 6 funkcji

| Funkcja | Plik | Efekt |
|---------|------|-------|
| Build_Post_Cart_Fields | rd_editcart | Buduje curl form z edit_cart_values |
| Build_Post_Cut_Fields | rd_editcut | Buduje curl form z edit_cut_values |
| RD_ListCartCuts_GetCut | rd_listcartcuts | Accessor: cart->cuts[pos] |
| RD_ListCartCuts_Free | rd_listcartcuts | Zwalnia pamiec cutow koszyka |
| RD_ListCartsCuts_GetCut | rd_listcartscuts | Accessor: carts[i]->cuts[j] |
| RD_ListCartsCuts_Free | rd_listcartscuts | Zwalnia pamiec cutow wielu koszykow |

---

## Reguly biznesowe (z implementacji)

- **Partial update pattern:** EditCart i EditCut uzywaja par pole+use_flag -- tylko pola z use_*=1 sa wysylane do serwera. Pozwala na atomowa edycje wybranych pol bez nadpisywania reszty.
- **Autentykacja dwutorowa:** Kazda funkcja akceptuje zarowno username/passwd jak i ticket. CreateTicket wymaga username/passwd i zwraca token z data wygasniecia.
- **Konwencja bledow:** 0=OK, -1=blad curl, HTTP_CODE=blad serwera. Sukces to HTTP 200-299.
- **Zarzadzanie pamiecia:** Funkcje alokuja pamiec (malloc/realloc) -- caller musi zwolnic (free lub dedykowana _Free).
- **SaveLog to full replace:** RD_SaveLog zapisuje caly log (header + N linii) -- nie jest to partial update lecz pelna zamiana.
- **Datetime handling:** ISO 8601 z timezone (Z/+HH:MM/-HH:MM), konwersja do local time. Precyzja czasu: 1/10 sekundy.
- **Cart types:** Audio (odtwarzane) vs Macro (sekwencja komend RML). Filtr TYPE_ALL obejmuje oba.
- **Dayparting:** Cuty maja okna waznosci (start/end datetime) + dozwolone dni tygodnia + pora dnia (daypart). Pozwala na planowanie rotacji czasowej.
- **Segue/Fade/Hook/Talk points:** Cut ma 5 par punktow edycyjnych definiujacych sposob odtwarzania (segue=przejscie, fade=znikanie/pojawianie, hook=fragment "chwytliwy", talk=zona lektora).
- **Weight-based rotation:** Cut ma pole weight -- waga prawdopodobienstwa wyboru przy automatycznej rotacji w koszyku z wieloma cutami.

---

## Linux-specific uzycia

Brak. Biblioteka jest platform-agnostic (pure C, libcurl, libexpat). Posiada #ifdef _WIN32 / MINGW32 guardy dla kompatybilnosci Windows.

---

## Zaleznosci zewnetrzne

| Biblioteka | Typ | Uzycie |
|------------|-----|--------|
| libcurl | external | HTTP POST (curl_easy_*, curl_formadd) |
| libexpat | external | XML SAX parsing (XML_ParserCreate, XML_SetElementHandler) |
| libm | system | math.h (fmod w get_local_offset) |

---

## Zaleznosci od innych artefaktow Rivendell

Brak. librivwebcapi jest calkowicie niezalezna od reszty Rivendell -- komunikuje sie z Rivendell wylacznie poprzez HTTP Web API (rdxport.cgi). Moze byc budowana samodzielnie (wlasny configure.ac).

---

## Missing Coverage

| Element | Plik | Powod braku |
|---------|------|-------------|
| (brak) | - | Wszystkie 49 headerow i 45 plikow .c pokryte |

---

## Conflicts

| ID | Element | Opis konfliktu | Status |
|----|---------|----------------|--------|
| (brak) | - | - | - |
