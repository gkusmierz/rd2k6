---
partial_id: "002"
artifact: WCA
class_name: Data Structures (header-only)
header_file: rd_cart.h, rd_cut.h, rd_group.h, rd_schedcodes.h
source_file: null
phase: 2
status: done
agent_version: 1.1.0
---

# Struktury danych (header-only)

## Typ
Pure C struct definitions. Brak pliku .c -- uzywane przez funkcje API jako nosniki danych.

## Odpowiedzialnosc (WHAT)
Definiuja struktury danych reprezentujace glowne encje domenowe systemu Rivendell: koszyki audio (cart), elementy audio (cut), grupy koszykow (group), kody schedulera (schedcodes). Sa to "DTO" (Data Transfer Objects) -- nosniki danych zwracanych przez serwer Web API i parsowanych z XML.

---

### struct rd_cart (rd_cart.h)

Reprezentuje koszyk audio -- podstawowa jednostke organizacji audio w Rivendell.

| Pole | Typ | Znaczenie biznesowe |
|------|-----|---------------------|
| cart_number | unsigned | Unikalny numer koszyka (identyfikator) |
| cart_type | unsigned | Typ: audio lub macro (enum CART_TYPE) |
| cart_grp_name[41] | char[] | Nazwa grupy do ktorej nalezy koszyk |
| cart_title[1021] | char[] | Tytul utworu/elementu |
| cart_artist[1021] | char[] | Artysta/wykonawca |
| cart_album[1021] | char[] | Album |
| cart_year | int | Rok wydania |
| cart_label[257] | char[] | Wytworna |
| cart_client[257] | char[] | Klient (dla spotow reklamowych) |
| cart_agency[257] | char[] | Agencja reklamowa |
| cart_publisher[257] | char[] | Wydawca |
| cart_composer[257] | char[] | Kompozytor |
| cart_conductor[257] | char[] | Dyrygent |
| cart_user_defined[1021] | char[] | Pole uzytkownika (dowolne metadane) |
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
| cart_owner[257] | char[] | Wlasciciel koszyka |
| cart_notes[4096] | char[] | Notatki |
| cart_metadata_datetime | struct tm | Data/czas ostatniej modyfikacji metadanych |
| cart_cut_quantity | unsigned | Liczba cutow w koszyku |
| cart_cuts | struct rd_cut ** | Tablica wskaznikow do cutow (alokowana dynamicznie) |

**Enum CART_TYPE:**
| Wartosc | Nazwa | Znaczenie |
|---------|-------|-----------|
| 0 | TYPE_ALL | Wszystkie typy (filtr) |
| 1 | TYPE_AUDIO | Koszyk audio |
| 2 | TYPE_MACRO | Koszyk makr (sekwencja komend RML) |

**Relacja:** rd_cart zawiera tablice rd_cut** (1:N -- koszyk moze miec wiele cutow).

---

### struct rd_cut (rd_cut.h)

Reprezentuje element audio (cut) -- pojedynczy plik dzwiekowy w koszyku.

| Pole | Typ | Znaczenie biznesowe |
|------|-----|---------------------|
| cut_name[41] | char[] | Unikalna nazwa cuta (format: NNNNNN_NNN) |
| cut_cart_number | unsigned | Numer koszyka-rodzica |
| cut_cut_number | unsigned | Numer cuta w koszyku |
| cut_evergreen | int | Evergreen flag (zawsze aktualny, bool) |
| cut_description[257] | char[] | Opis cuta |
| cut_outcue[257] | char[] | Outcue (tekst dla operatora do momentu konca) |
| cut_isrc[49] | char[] | Kod ISRC (International Standard Recording Code) |
| cut_isci[129] | char[] | Kod ISCI (industry standard commercial identification) |
| cut_length | unsigned | Dlugosc audio (ms) |
| cut_origin_datetime | struct tm | Data/czas nagrania/importu |
| cut_start_datetime | struct tm | Poczatek okna waznosci (dayparting) |
| cut_end_datetime | struct tm | Koniec okna waznosci |
| cut_sun..cut_sat | int | Dozwolone dni tygodnia (po jednym bool na dzien) |
| cut_start_daypart[15] | char[] | Poczatek daypartu (pora dnia) |
| cut_end_daypart[15] | char[] | Koniec daypartu |
| cut_origin_name[257] | char[] | Zrodlo nagrania |
| cut_origin_login_name[1021] | char[] | Login uzytkownika ktory nagral/importowal |
| cut_source_hostname[1021] | char[] | Hostname zrodla |
| cut_weight | unsigned | Waga (prawdopodobienstwo wyboru przy rotacji) |
| cut_last_play_datetime | struct tm | Data ostatniego odtworzenia |
| cut_play_counter | unsigned | Licznik odtworzen (globalny) |
| cut_local_counter | unsigned | Licznik odtworzen (lokalny) |
| cut_validity | unsigned | Status waznosci |
| cut_coding_format | unsigned | Format kodowania audio |
| cut_sample_rate | unsigned | Czestotliwosc probkowania |
| cut_bit_rate | unsigned | Bitrate |
| cut_channels | unsigned | Liczba kanalow |
| cut_play_gain | int | Gain odtwarzania (dB) |
| cut_start_point | int | Punkt startu (ms) |
| cut_end_point | int | Punkt konca (ms) |
| cut_fadeup_point | int | Punkt fade-up (ms) |
| cut_fadedown_point | int | Punkt fade-down (ms) |
| cut_segue_start_point | int | Poczatek segue (ms) |
| cut_segue_end_point | int | Koniec segue (ms) |
| cut_segue_gain | int | Gain segue (dB) |
| cut_hook_start_point | int | Poczatek hooka (ms) -- fragment "chwytliwy" |
| cut_hook_end_point | int | Koniec hooka (ms) |
| cut_talk_start_point | int | Poczatek talk-over (ms) -- zona dla lektora |
| cut_talk_end_point | int | Koniec talk-over (ms) |

---

### struct rd_group (rd_group.h)

Reprezentuje grupe koszykow -- organizacyjna kategorie audio w systemie.

| Pole | Typ | Znaczenie biznesowe |
|------|-----|---------------------|
| grp_name[41] | char[] | Nazwa grupy (identyfikator) |
| grp_desc[1021] | char[] | Opis grupy |
| grp_default_cart_type | unsigned | Domyslny typ koszyka (audio/macro) |
| grp_lo_limit | unsigned | Dolna granica zakresu numerow koszykow |
| grp_hi_limit | unsigned | Gorna granica zakresu numerow koszykow |
| grp_shelf_life | int | Czas waznosci (shelf life) w dniach |
| grp_default_title[1021] | char[] | Domyslny tytul dla nowych koszykow |
| grp_enforce_range | int | Wymuszenie zakresu numerow (bool) |
| grp_report_tfc | int | Raportowanie traffic (bool) |
| grp_report_mus | int | Raportowanie muzyczne (bool) |
| grp_now_next | int | Wlaczone Now/Next (bool) |
| grp_color[8] | char[] | Kolor grupy (hex, np. "#FF0000") |

---

### struct rd_schedcodes (rd_schedcodes.h)

Reprezentuje kod schedulera -- tag uzywany do kategoryzacji koszykow w procesie planowania ramowki.

| Pole | Typ | Znaczenie biznesowe |
|------|-----|---------------------|
| code[41] | char[] | Kod (identyfikator) |
| description[1021] | char[] | Opis kodu |
