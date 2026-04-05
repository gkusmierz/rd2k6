---
partial_id: "004"
artifact: WCA
class_name: API Functions (45 functions)
header_file: (all 45 .h files)
source_file: (all 45 .c files)
phase: 2
status: done
agent_version: 1.1.0
---

# Funkcje API

## Typ
Pure C functions. Kazda funkcja to samodzielna jednostka realizujaca jedno wywolanie HTTP POST
do Rivendell Web API (rdxport.cgi) i parsujaca odpowiedz XML.

## Wspolny wzorzec implementacji (WHAT)

Wszystkie funkcje API (z wyjatkiem RD_GetVersion, RD_GetUserAgent, Build_Post_*) realizuja
identyczny wzorzec:

1. Inicjalizacja libcurl (curl_easy_init)
2. Konfiguracja Expat XML parser z callbackami Start/Data/End
3. Budowanie URL: `http://{hostname}/rd-bin/rdxport.cgi`
4. Budowanie HTTP POST form fields (COMMAND=N, LOGIN_NAME, PASSWORD, TICKET, parametry specyficzne)
5. Opcjonalny User-Agent (custom lub default: "rivwebcapi/{VERSION}")
6. Wykonanie HTTP POST (curl_easy_perform)
7. Parsowanie XML response do odpowiedniej struktury C
8. Zwrot: 0 = sukces, -1 = blad curl, HTTP_CODE = blad serwera (200-299 = OK)

## Autentykacja

Kazda funkcja API akceptuje 2 sciezki autentykacji (uzywane zamiennie):
- **Username + Password** -- klasyczne logowanie
- **Ticket** -- token sesyjny (uzyskany przez RD_CreateTicket), z data wygasniecia

Parametry auth sa zawsze obecne: hostname, username, passwd, ticket, user_agent.

---

## Zarzadzanie koszykami (Carts)

### RD_AddCart
| Plik | rd_addcart.h / rd_addcart.c |
|------|----------------------------|
| Sygnatura | `int RD_AddCart(struct rd_cart *cart[], hostname, username, passwd, ticket, group, type, cartnumber, user_agent, *numrecs)` |
| Efekt | Tworzy nowy koszyk w podanej grupie z podanym typem (audio/macro) i opcjonalnym numerem |
| Zwraca | Utworzony rd_cart (via *cart, *numrecs=1) |
| COMMAND | 12 |

### RD_EditCart
| Plik | rd_editcart.h / rd_editcart.c |
|------|-------------------------------|
| Sygnatura | `int RD_EditCart(struct rd_cart *cart[], edit_cart_values, hostname, username, passwd, ticket, cartnum, user_agent, *numrecs)` |
| Efekt | Aktualizuje metadane koszyka (tylko pola z use_*=1 w edit_cart_values) |
| Zwraca | Zaktualizowany rd_cart |
| Pomocnicza | `Build_Post_Cart_Fields()` -- buduje curl form fields z edit_cart_values |

### RD_RemoveCart
| Plik | rd_removecart.h / rd_removecart.c |
|------|----------------------------------|
| Sygnatura | `int RD_RemoveCart(hostname, username, passwd, ticket, cartnumber, user_agent)` |
| Efekt | Usuwa koszyk (i wszystkie jego cuty) |
| Zwraca | Brak struktury -- tylko kod statusu |

### RD_ListCart
| Plik | rd_listcart.h / rd_listcart.c |
|------|-------------------------------|
| Sygnatura | `int RD_ListCart(struct rd_cart *carts[], hostname, username, passwd, ticket, cartnumber, user_agent, *numrecs)` |
| Efekt | Pobiera metadane jednego koszyka po numerze |
| Zwraca | rd_cart (*numrecs=1) |
| COMMAND | 7 |

### RD_ListCarts
| Plik | rd_listcarts.h / rd_listcarts.c |
|------|--------------------------------|
| Sygnatura | `int RD_ListCarts(struct rd_cart *carts[], hostname, username, passwd, ticket, group_name, filter, type, user_agent, *numrecs)` |
| Efekt | Listuje koszyki z filtrowaniem po grupie, tekst filter, typie |
| Zwraca | Tablica rd_cart[] (*numrecs = ilosc) |

### RD_ListCartCuts
| Plik | rd_listcartcuts.h / rd_listcartcuts.c |
|------|--------------------------------------|
| Sygnatura | `int RD_ListCartCuts(struct rd_cart *carts[], hostname, username, passwd, ticket, cartnumber, user_agent, *numrecs)` |
| Efekt | Pobiera koszyk wraz z jego cutami (zagniezdzone w cart_cuts) |
| Zwraca | rd_cart z wypelniona tablica cart_cuts |
| Pomocnicze | `RD_ListCartCuts_GetCut(cart, pos)` -- accessor do cuta; `RD_ListCartCuts_Free(cart)` -- zwalnia pamiec |

### RD_ListCartsCuts
| Plik | rd_listcartscuts.h / rd_listcartscuts.c |
|------|----------------------------------------|
| Sygnatura | `int RD_ListCartsCuts(struct rd_cart *carts[], hostname, username, passwd, ticket, group_name, filter, type, user_agent, *numrecs)` |
| Efekt | Listuje wiele koszykow z cutami (filtrowanie jak ListCarts) |
| Zwraca | Tablica rd_cart[] z zagniezdzonymi cutami |
| Pomocnicze | `RD_ListCartsCuts_GetCut(carts, cart_rec, cut_rec)` -- accessor; `RD_ListCartsCuts_Free(carts, numrecs)` -- zwalnia pamiec |

### RD_ListCartSchedCodes
| Plik | rd_listcartschedcodes.h / rd_listcartschedcodes.c |
|------|--------------------------------------------------|
| Sygnatura | `int RD_ListCartSchedCodes(struct rd_schedcodes *schedcodes[], hostname, username, passwd, ticket, cartnum, user_agent, *numrecs)` |
| Efekt | Pobiera kody schedulera przypisane do koszyka |
| Zwraca | Tablica rd_schedcodes[] |

### RD_AssignSchedCode
| Plik | rd_assignschedcode.h / rd_assignschedcode.c |
|------|---------------------------------------------|
| Sygnatura | `int RD_AssignSchedCode(hostname, username, passwd, ticket, cartnum, code, user_agent)` |
| Efekt | Przypisuje kod schedulera do koszyka |
| Zwraca | Tylko status |

### RD_UnassignSchedCode
| Plik | rd_unassignschedcode.h / rd_unassignschedcode.c |
|------|-------------------------------------------------|
| Sygnatura | `int RD_UnassignSchedCode(hostname, username, passwd, ticket, cartnum, code, user_agent)` |
| Efekt | Usuwa kod schedulera z koszyka |
| Zwraca | Tylko status |

---

## Zarzadzanie cutami (Cuts)

### RD_AddCut
| Plik | rd_addcut.h / rd_addcut.c |
|------|--------------------------|
| Sygnatura | `int RD_AddCut(struct rd_cut *cut[], hostname, username, passwd, ticket, cartnumber, user_agent, *numrecs)` |
| Efekt | Dodaje nowy cut do istniejacego koszyka |
| Zwraca | Utworzony rd_cut |

### RD_EditCut
| Plik | rd_editcut.h / rd_editcut.c |
|------|----------------------------|
| Sygnatura | `int RD_EditCut(struct rd_cut *cut[], edit_cut_values, hostname, username, passwd, ticket, cartnum, cutnum, user_agent, *numrecs)` |
| Efekt | Aktualizuje metadane cuta (partial update via use_* flags) |
| Zwraca | Zaktualizowany rd_cut |
| Pomocnicza | `Build_Post_Cut_Fields()` |

### RD_RemoveCut
| Plik | rd_removecut.h / rd_removecut.c |
|------|--------------------------------|
| Sygnatura | `int RD_RemoveCut(hostname, username, passwd, ticket, cartnumber, cutnumber, user_agent)` |
| Efekt | Usuwa cut z koszyka |

### RD_ListCut
| Plik | rd_listcut.h / rd_listcut.c |
|------|----------------------------|
| Sygnatura | `int RD_ListCut(struct rd_cut *cuts[], hostname, username, passwd, ticket, cartnumber, cutnumber, user_agent, *numrecs)` |
| Efekt | Pobiera metadane jednego cuta |
| Zwraca | rd_cut |

### RD_ListCuts
| Plik | rd_listcuts.h / rd_listcuts.c |
|------|-------------------------------|
| Sygnatura | `int RD_ListCuts(struct rd_cut *cuts[], hostname, username, passwd, ticket, cartnumber, user_agent, *numrecs)` |
| Efekt | Listuje wszystkie cuty koszyka |
| Zwraca | Tablica rd_cut[] |

---

## Audio

### RD_AudioInfo
| Plik | rd_audioinfo.h / rd_audioinfo.c |
|------|--------------------------------|
| Sygnatura | `int RD_AudioInfo(struct rd_audioinfo *audioinfo[], hostname, username, passwd, ticket, cartnumber, cutnumber, user_agent, *numrecs)` |
| Efekt | Pobiera informacje techniczne o pliku audio cuta (format, kanaly, sample rate, dlugosc) |

### RD_AudioStore
| Plik | rd_audiostore.h / rd_audiostore.c |
|------|----------------------------------|
| Sygnatura | `int RD_AudioStore(struct rd_audiostore *audiostore[], hostname, username, passwd, ticket, user_agent, *numrecs)` |
| Efekt | Pobiera informacje o stanie magazynu audio (wolne/calkowite bajty) |

### RD_ExportCart
| Plik | rd_export.h / rd_export.c |
|------|--------------------------|
| Sygnatura | `int RD_ExportCart(hostname, username, passwd, ticket, cartnum, cutnum, format, channels, sample_rate, bit_rate, quality, start_point, end_point, normalization_level, enable_metadata, filename, user_agent)` |
| Efekt | Eksportuje audio cuta do pliku lokalnego z opcjonalna konwersja formatu, normalizacja i metadanymi |

### RD_ImportCart
| Plik | rd_import.h / rd_import.c |
|------|--------------------------|
| Sygnatura | `int RD_ImportCart(struct rd_cartimport *cartimport[], hostname, username, passwd, ticket, cartnum, cutnum, channels, normalization_level, autotrim_level, use_metadata, create, group, title, filename, user_agent, *numrecs)` |
| Efekt | Importuje plik audio do koszyka/cuta, opcjonalnie tworzac nowy koszyk (create=1) |
| Zwraca | rd_cartimport (response_code, error_string, cart/cut number) |

### RD_ExportPeaks
| Plik | rd_exportpeaks.h / rd_exportpeaks.c |
|------|-------------------------------------|
| Sygnatura | `int RD_ExportPeaks(hostname, username, passwd, ticket, cartnum, cutnum, filename, user_agent)` |
| Efekt | Eksportuje dane peak (waveform) cuta do pliku |

### RD_CopyAudio
| Plik | rd_copyaudio.h / rd_copyaudio.c |
|------|--------------------------------|
| Sygnatura | `int RD_CopyAudio(hostname, username, passwd, ticket, src_cartnumber, src_cutnumber, dest_cartnumber, dest_cutnumber, user_agent)` |
| Efekt | Kopiuje dane audio z jednego cuta do drugiego (source -> destination) |

### RD_DeleteAudio
| Plik | rd_deleteaudio.h / rd_deleteaudio.c |
|------|-------------------------------------|
| Sygnatura | `int RD_DeleteAudio(hostname, username, passwd, ticket, cartnumber, cutnumber, user_agent)` |
| Efekt | Usuwa dane audio cuta (zachowuje metadane) |

### RD_TrimAudio
| Plik | rd_trimaudio.h / rd_trimaudio.c |
|------|--------------------------------|
| Sygnatura | `int RD_TrimAudio(struct rd_trimaudio *trimaudio[], hostname, username, passwd, ticket, cartnumber, cutnumber, trimlevel, user_agent, *numrecs)` |
| Efekt | Wyznacza punkty trim (start/end) dla cuta na zadanym poziomie (dB) |
| Zwraca | rd_trimaudio (starttrimpoint, endtrimpoint) |

---

## Logi

### RD_AddLog
| Plik | rd_addlog.h / rd_addlog.c |
|------|--------------------------|
| Sygnatura | `int RD_AddLog(hostname, username, passwd, ticket, logname, servicename, user_agent)` |
| Efekt | Tworzy nowy pusty log playoutowy dla serwisu |

### RD_DeleteLog
| Plik | rd_deletelog.h / rd_deletelog.c |
|------|-------------------------------|
| Sygnatura | `int RD_DeleteLog(hostname, username, passwd, ticket, logname, user_agent)` |
| Efekt | Usuwa log |

### RD_ListLog
| Plik | rd_listlog.h / rd_listlog.c |
|------|----------------------------|
| Sygnatura | `int RD_ListLog(struct rd_logline *logline[], hostname, username, passwd, ticket, logname, user_agent, *numrecs)` |
| Efekt | Pobiera zawartosc logu (wszystkie linie) |
| Zwraca | Tablica rd_logline[] |

### RD_ListLogs
| Plik | rd_listlogs.h / rd_listlogs.c |
|------|-------------------------------|
| Sygnatura | `int RD_ListLogs(struct rd_log *logs[], hostname, username, passwd, ticket, servicename, logname, trackable, filter, recent, user_agent, *numrecs)` |
| Efekt | Listuje logi z filtrowaniem po serwisie, nazwie, trackable, tekst filter, recent |
| Zwraca | Tablica rd_log[] |

### RD_SaveLog
| Plik | rd_savelog.h / rd_savelog.c |
|------|---------------------------|
| Sygnatura | `int RD_SaveLog(save_loghdr_values *hdrvals, save_logline_values *linevals, linevals_quan, hostname, username, passwd, ticket, logname, user_agent)` |
| Efekt | Zapisuje/aktualizuje caly log (naglowek + N linii) -- pelna zamiana zawartosci |

---

## Grupy i serwisy

### RD_ListGroup
| Plik | rd_listgroup.h / rd_listgroup.c |
|------|--------------------------------|
| Sygnatura | `int RD_ListGroup(struct rd_group *grp[], hostname, username, passwd, ticket, group, user_agent, *numrecs)` |
| Efekt | Pobiera metadane jednej grupy |

### RD_ListGroups
| Plik | rd_listgroups.h / rd_listgroups.c |
|------|----------------------------------|
| Sygnatura | `int RD_ListGroups(struct rd_group *grps[], hostname, username, passwd, ticket, user_agent, *numrecs)` |
| Efekt | Listuje wszystkie grupy w systemie |

### RD_ListServices
| Plik | rd_listservices.h / rd_listservices.c |
|------|--------------------------------------|
| Sygnatura | `int RD_ListServices(struct rd_service *services[], hostname, username, passwd, ticket, trackable, user_agent, *numrecs)` |
| Efekt | Listuje serwisy radiowe (opcjonalnie tylko trackable) |

### RD_ListSchedCodes
| Plik | rd_listschedcodes.h / rd_listschedcodes.c |
|------|------------------------------------------|
| Sygnatura | `int RD_ListSchedCodes(struct rd_schedcodes *schedcodes[], hostname, username, passwd, ticket, user_agent, *numrecs)` |
| Efekt | Listuje wszystkie kody schedulera w systemie |

### RD_ListSystemSettings
| Plik | rd_listsystemsettings.h / rd_listsystemsettings.c |
|------|--------------------------------------------------|
| Sygnatura | `int RD_ListSystemSettings(struct rd_system_settings *settings[], hostname, username, passwd, ticket, user_agent, *numrecs)` |
| Efekt | Pobiera ustawienia systemowe Rivendell |

---

## Podcasting / RSS / Images

### RD_PostPodcast
| Plik | rd_postpodcast.h / rd_postpodcast.c |
|------|-------------------------------------|
| Sygnatura | `int RD_PostPodcast(hostname, username, passwd, ticket, cast_id, user_agent)` |
| Efekt | Publikuje (uploaduje) audio podcastu po cast_id |

### RD_SavePodcast
| Plik | rd_savepodcast.h / rd_savepodcast.c |
|------|-------------------------------------|
| Sygnatura | `int RD_SavePodcast(hostname, username, passwd, ticket, cast_id, filename, user_agent)` |
| Efekt | Pobiera (downloaduje) plik audio podcastu do pliku lokalnego |

### RD_DeletePodcast
| Plik | rd_deletepodcast.h / rd_deletepodcast.c |
|------|----------------------------------------|
| Sygnatura | `int RD_DeletePodcast(hostname, username, passwd, ticket, cast_id, user_agent)` |
| Efekt | Usuwa audio podcastu (dane mediowe) |

### RD_RemovePodcast
| Plik | rd_removepodcast.h / rd_removepodcast.c |
|------|----------------------------------------|
| Sygnatura | `int RD_RemovePodcast(hostname, username, passwd, ticket, cast_id, user_agent)` |
| Efekt | Usuwa item podcastu (metadane + media) |

### RD_PostRss
| Plik | rd_postrss.h / rd_postrss.c |
|------|----------------------------|
| Sygnatura | `int RD_PostRss(hostname, username, passwd, ticket, feed_id, user_agent)` |
| Efekt | Publikuje (regeneruje) feed RSS po feed_id |

### RD_RemoveRss
| Plik | rd_removerss.h / rd_removerss.c |
|------|--------------------------------|
| Sygnatura | `int RD_RemoveRss(hostname, username, passwd, ticket, feed_id, user_agent)` |
| Efekt | Usuwa feed RSS |

### RD_PostImage
| Plik | rd_postimage.h / rd_postimage.c |
|------|--------------------------------|
| Sygnatura | `int RD_PostImage(hostname, username, passwd, ticket, img_id, user_agent)` |
| Efekt | Publikuje obraz po img_id |

### RD_RemoveImage
| Plik | rd_removeimage.h / rd_removeimage.c |
|------|-------------------------------------|
| Sygnatura | `int RD_RemoveImage(hostname, username, passwd, ticket, img_id, user_agent)` |
| Efekt | Usuwa obraz |

---

## Autentykacja i metadane

### RD_CreateTicket
| Plik | rd_createticket.h / rd_createticket.c |
|------|--------------------------------------|
| Sygnatura | `int RD_CreateTicket(struct rd_ticketinfo *ticketinfo[], hostname, username, passwd, user_agent, *numrecs)` |
| Efekt | Tworzy bilet (token) sesyjny dla uzytkownika -- alternatywa dla username/passwd w kolejnych wywolaniach |
| Zwraca | rd_ticketinfo (ticket token + expiration datetime) |
| Uwaga | Jedyna funkcja bez parametru ticket (bo go dopiero tworzy) |

### RD_GetVersion
| Plik | rd_getversion.h / rd_getversion.c |
|------|----------------------------------|
| Sygnatura | `char * RD_GetVersion()` |
| Efekt | Zwraca string wersji biblioteki (compile-time VERSION) |
| Uwaga | Nie wymaga polaczenia z serwerem -- pure local |

### RD_GetUserAgent
| Plik | rd_getuseragent.h / rd_getuseragent.c |
|------|--------------------------------------|
| Sygnatura | `char * RD_GetUserAgent()` |
| Efekt | Zwraca domyslny User-Agent string ("rivwebcapi/") |
| Uwaga | Nie wymaga polaczenia z serwerem -- pure local |
| Makro | USER_AGENT_STRING = "rivwebcapi/" |

---

## Funkcje pomocnicze (internal)

### Build_Post_Cart_Fields (rd_editcart.h)
| Sygnatura | `void Build_Post_Cart_Fields(curl_httppost **first, curl_httppost **last, edit_cart_values)` |
| Efekt | Buduje curl multipart form fields z edit_cart_values (tylko pola z use_*=1) |

### Build_Post_Cut_Fields (rd_editcut.h)
| Sygnatura | `void Build_Post_Cut_Fields(curl_httppost **first, curl_httppost **last, edit_cut_values)` |
| Efekt | Buduje curl multipart form fields z edit_cut_values (tylko pola z use_*=1) |

### RD_ListCartCuts_GetCut (rd_listcartcuts.h)
| Sygnatura | `struct rd_cut *RD_ListCartCuts_GetCut(struct rd_cart *cart, int pos)` |
| Efekt | Accessor do cuta w cart->cart_cuts[pos] |

### RD_ListCartCuts_Free (rd_listcartcuts.h)
| Sygnatura | `void RD_ListCartCuts_Free(struct rd_cart *cart)` |
| Efekt | Zwalnia dynamicznie zaalokowana tablice cutow |

### RD_ListCartsCuts_GetCut (rd_listcartscuts.h)
| Sygnatura | `struct rd_cut *RD_ListCartsCuts_GetCut(struct rd_cart carts[], int cart_rec, int cut_rec)` |
| Efekt | Accessor do cuta w tablicy koszykow |

### RD_ListCartsCuts_Free (rd_listcartscuts.h)
| Sygnatura | `void RD_ListCartsCuts_Free(struct rd_cart carts[], int numrecs)` |
| Efekt | Zwalnia dynamicznie zaalokowane tablice cutow dla wielu koszykow |
