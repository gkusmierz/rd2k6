---
phase: 5
artifact: LIB
source: docs
status: done
---

# Documentation Facts: librd

## Zrodlo: docs/opsguide/*.xml (DocBook XML)

## Koncepty bazowe (z overview.xml)

| Koncept | Definicja | Zrodlo |
|---------|-----------|--------|
| Host | Kazdy fizyczny komputer w sieci Rivendell. Moze byc indywidualnie konfigurowany i kontrolowany z innego hosta. | docs/opsguide/overview.xml:sect.overview.hosts |
| User | Zestaw polityk dostepu definiujacy co host moze robic. Kazdy host ma co najmniej jednego "default user" ladowanego przy starcie. Mozna zmienic uzytkownika przez RDLogin. | docs/opsguide/overview.xml:sect.overview.users |
| Group | System kategorii do klasyfikacji i organizacji audio w bibliotece. Operacje moga byc specyfikowane na bazie przynaleznosci grupowej. Schemat jest calkowicie dowolny (nazwa, liczba). | docs/opsguide/overview.xml:sect.overview.groups |
| Service | Docelowe miejsce przeznaczenia audio (stacja radiowa, uplink, stream). Parametry playout i log creation sa konfigurowane per service. | docs/opsguide/overview.xml:sect.overview.services |
| Cart | Kontener danych trzymajacy audio (audio cart) lub makra RML (macro cart). Fundamentalny "atom" schedulingu - najmniejszy obiekt widoczny dla zewnetrznych systemow. | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_carts |
| Cut | Rzeczywisty kawalek audio w karcie. Analogiczny do "track" na CD. Karta moze zawierac do 999 cutow. | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cuts |
| Log | Sekwencja eventow do wykonania, ulozona chronologicznie (playlist). Kazdy log nalezy do dokladnie jednego service. | docs/opsguide/rdlogedit.xml:sect.rdlogedit.logs_and_log_events |
| Log Machine | Wirtualne "urzadzenie" do ladowania i wykonywania logow. RDAirPlay ma 3: Main Log, Aux 1 Log, Aux 2 Log - niezalezne od siebie. | docs/opsguide/rdairplay.xml:sect.rdairplay.log_machines |
| Macro Cart | Karta zawierajaca komendy RML (Rivendell Macro Language) zamiast audio. | docs/opsguide/rdlibrary.xml:sect.rdlibrary.macro_carts |
| Scheduler Code | Kod przypisywany do kartom, uzywany przez zewnetrzne schedulery do klasyfikacji. Zarzadzany w RDAdmin. | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_scheduler_codes |
| Dropbox | Proces Rivendell dzialajacy w tle, automatycznie importujacy pliki audio z systemu plikow. | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Feed | Podcast feed zarzadzany przez Rivendell. Itemy moga byc active (green), inactive (red), lub embargoed (blue). | docs/opsguide/rdcastmanager.xml:sect.rdcastmanager.overview |
| PAD | Program Associated Data - dane o aktualnie granym i nastepnym elemencie, emitowane jako JSON przez TCP port 34289. | docs/opsguide/pad.xml:sect.pad.the_json_interface |

## Use Cases (perspektywa operatora)

```gherkin
Rule: Tworzenie i edycja karty audio
  Scenario: Operator tworzy nowa karte audio
    Given operator jest w RDLibrary
    When  klika Add, wybiera grupe i typ karty (Audio/Macro)
    Then  nowa karta jest tworzona z unikalnym numerem (000001-999999)
    And   numer musi miescic sie w zakresie grupy jesli Enforce Cart Range jest wlaczony
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect2_rdlibrary_carts
  # Pewnosc: potwierdzone

Rule: Nagrywanie audio do cuta
  Scenario: Operator nagrywa audio w Record Dialog
    Given operator otworzyl cut w Record Dialog
    When  ustawia Channels (mono/stereo) i klika Record
    Then  system wchodzi w tryb "ready" (Record swieci, Play miga)
    And   bar meter pokazuje poziomy wejsciowe (peak w zoltym = optymalne)
    When  operator klika Play LUB audio pojawi sie (tryb VOX)
    Then  nagrywanie startuje
    And   trwa do klikniecia Stop LUB osiagniecia max dozwolonej dlugosci
    When  nagrywanie sie zakonczy i AutoTrim = On
    Then  markery Start/End ustawiane automatycznie na poczatek/koniec wykrytego audio
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.recording_and_auditioning_a_cut_in_the_record_dialog
  # Pewnosc: potwierdzone

Rule: Import audio z pliku
  Scenario: Operator importuje plik audio do cuta
    Given operator otworzyl Import/Export Audio Dialog dla cuta
    When  wybiera plik (WAV PCM16/24/MPEG, MP1/MP2/MP3, OGG, FLAC)
    And   ustawia Channels, opcjonalnie Normalize (peak do podanego dBFS) i Autotrim
    And   klika Import
    Then  progress bar pokazuje postep importu
    And   audio jest zaimportowane i dostepne do odsluchania
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file
  # Pewnosc: potwierdzone

Rule: Rippowanie z CD (pojedynczy track)
  Scenario: Operator rippuje track z CD do cuta
    Given operator otworzyl Rip CD Dialog dla cuta
    When  wklada CD do napedu
    Then  lista trackow pojawia sie po kilku sekundach
    And   jesli FreeDB jest wlaczony, nazwy trackow moga sie pojawic
    When  ustawia Channels, Normalize, Autotrim i klika Rip Track
    Then  track jest rippowany do cuta z progress barem
    And   jesli "Apply FreeDB Values to Cart" jest zaznaczony, metadane trafiaja na label karty
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.importing_audio_from_a_cd_track
  # Pewnosc: potwierdzone

Rule: Rippowanie wielu trackow z CD (batch)
  Scenario: Operator rippuje wiele trackow naraz
    Given operator klika "Rip CD" na glownym ekranie RDLibrary
    When  przypisuje kazdy track do innego cuta (przez Set Cut dialog)
    And   ustawia Normalize, Autotrim, Channels i klika "Rip Disk"
    Then  wszystkie tracki sa rippowane sekwencyjnie z progress barami per-track i overall
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.ripping_multiple_cd_tracks_at_a_time
  # Pewnosc: potwierdzone

Rule: Rotacja cutow w karcie (By Weight)
  Scenario: Karta audio ma wiele cutow z wagami
    Given karta ma Schedule Cuts = "By Weight"
    And   cuty maja rozne wartosci WEIGHT
    When  system wybiera cut do odtworzenia
    Then  proporcja odtworzenal kazdego cuta = waga_cuta / suma_wszystkich_wag
    And   system stara sie odtwarzac kazdy cut w proporcji do jego wagi
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting
  # Pewnosc: potwierdzone

Rule: Rotacja cutow w karcie (By Specified Order)
  Scenario: Karta audio ma cuty z okreslona kolejnoscia
    Given karta ma Schedule Cuts = "By Specified Order"
    When  system wybiera cut do odtworzenia
    Then  cuty sa odtwarzane w dokladnie podanej kolejnosci (pole ORDER)
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting
  # Pewnosc: potwierdzone

Rule: Dayparting cuta (ograniczenia czasowe)
  Scenario: Cut ma wlaczony dayparting
    Given cut ma Air Date/Time Enabled z zakresem dat
    And   cut ma Daypart Enabled z zakresem godzin
    And   cut ma odznaczony poniedzialek w Day of Week
    When  system sprawdza czy cut jest "eligible to play"
    Then  eligibility = AND logiczny wszystkich aktywnych ograniczen
    And   cut NIE zagra w poniedzialek, niezaleznie od innych regul
    And   dayparting wplywa TYLKO na modul on-air (RDAirPlay), w innych modulach cut zawsze gra
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting
  # Pewnosc: potwierdzone

Rule: Edycja markerow audio
  Scenario: Operator ustawia markery w Edit Markers Dialog
    Given operator otwiera Edit Markers Dialog dla cuta
    When  klika przycisk markera (np. Segue Start) i klika na waveformie
    Then  marker jest umieszczony na wskazanej pozycji
    And   markery parzyste (np. TalkStart) automatycznie tworca TalkEnd
    And   wyjatki: FadeUp/FadeDown sa pojedyncze; Start/End sa zawsze obecne i nie moga byc usuniete
  # Zrodlo: docs/opsguide/rdlibrary.xml:rdlibrary.editing_markers
  # Pewnosc: potwierdzone

Rule: Trim markerow
  Scenario: Automatyczne ustawienie Start/End na podstawie progu
    Given operator jest w Edit Markers Dialog
    When  klika Trim Start
    Then  marker Start jest ustawiany na pierwsza instancje poziomu >= Threshold
    When  klika Trim End
    Then  marker End jest ustawiany na ostatnia instancje poziomu >= Threshold
  # Zrodlo: docs/opsguide/rdlibrary.xml:rdlibrary.editing_markers
  # Pewnosc: potwierdzone

Rule: Automatyczny import przez Dropbox
  Scenario: Dropbox wykrywa nowy plik
    Given dropbox jest skonfigurowany z PathSpec i Default Group
    And   grupa ma ustawiony zakres Default Cart Number
    When  plik pasujacy do PathSpec pojawia sie w lokalizacji
    Then  dropbox tworzy nowa karte w grupie
    And   importuje plik do nowego cuta w karcie
    And   import odbywa sie JEDNOKROTNIE per plik (bez ponownego przetwarzania)
    And   opcjonalnie: plik zrodlowy jest usuwany po imporcie
  # Zrodlo: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes
  # Pewnosc: potwierdzone

Rule: Tryby automatyzacji logu
  Scenario: Zmiana trybu log machine
    Given log jest zaladowany w log machine
    When  tryb = Automatic
    Then  wszystkie funkcje logu wlaczone: PLAY, SEGUE transitions, hard times
    When  tryb = LiveAssist
    Then  brak automatycznych transitions i hard times, ALE automatyczne crossfade
    When  tryb = Manual
    Then  jak LiveAssist ale BEZ automatycznych crossfade (pelna kontrola reczna z konsoli)
  # Zrodlo: docs/opsguide/rdairplay.xml:sect.rdairplay.layout
  # Pewnosc: potwierdzone

Rule: Typy eventow w logu
  Scenario: Log zawiera rozne typy eventow
    Given log jest edytowany w RDLogEdit
    Then  mozliwe typy eventow: Audio Cart, Voice Track Audio Cart, Macro Cart, Note Marker, Track Marker, Chain Event, Music Import Link, Traffic Import Link
  # Zrodlo: docs/opsguide/rdlogedit.xml:table.rdlogedit.log_event_type_icons
  # Pewnosc: potwierdzone

Rule: Generowanie raportow biblioteki
  Scenario: Operator generuje raport
    Given operator klika Reports w RDLibrary
    Then  dostepne raporty: Cart Report (lista kart z atrybutami), Cut Report (lista cutow z atrybutami), Cart Data Dump CSV (dane per cut dla eksportu do zewnetrznych systemow)
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.generating_library_reports
  # Pewnosc: potwierdzone

Rule: Kopiowanie audio miedzy cutami
  Scenario: Operator kopiuje audio z jednego cuta do innego
    Given operator zaznacza cut w Edit Cart Dialog
    When  klika Copy, potem zaznacza docelowy cut (w tej samej lub innej karcie)
    And   klika Paste
    Then  audio jest skopiowane do docelowego cuta
  # Zrodlo: docs/opsguide/rdlibrary.xml:sect.rdlibrary.copying_and_pasting_audio_from_cut_to_cut
  # Pewnosc: potwierdzone

Rule: RML Protocol
  Scenario: Wyslanie komendy RML
    Given komenda RML ma format: cmd [arg] [...]!
    When  komenda jest wyslana na UDP port 5858
    Then  system moze odpowiedziec ACK (+) lub NAK (-) na port 5860
    When  komenda jest wyslana na UDP port 5859
    Then  system przetwarza bez odpowiedzi
  # Zrodlo: docs/opsguide/rml.xml:sect.rml.protocol, sect.rml.command_delivery
  # Pewnosc: potwierdzone

Rule: RML Copy Cut
  Scenario: Kopiowanie cuta przez RML
    Given komenda CP srccart srccut dstcart dstcut!
    When  jest wykonana
    Then  audio i metadane sa kopiowane z source do destination
    And   destination cart/cut MUSI juz istniec
  # Zrodlo: docs/opsguide/rml.xml:sect.rml.copy_cut__cp_
  # Pewnosc: potwierdzone

Rule: Voicetracking
  Scenario: Operator nagrywa voice track
    Given voicetrack group i pula numerow kartow sa skonfigurowane w RDAdmin
    When  operator otwiera VoiceTracker z RDLogEdit
    Then  voice track karty sa automatycznie tworzone, usuwane i zarzadzane
    And   operator moze dostosowac transitions miedzy elementami logu
    And   jesli transition type = SEGUE, mozna adjustowac stopien overlap audio
  # Zrodlo: docs/opsguide/voicetracking.xml:sect.voicetracking.voicetracking_in_rivendell
  # Pewnosc: potwierdzone

Rule: PAD Updates
  Scenario: System emituje now/next update
    Given log jest odtwarzany w log machine
    When  nowy event zaczyna grac
    Then  JSON padUpdate jest emitowany na TCP port 34289
    And   zawiera: dateTime, hostName, machine, onairFlag, mode, service, log name, now (cart/cut details), next (cart/cut details)
    And   cart details obejmuja: cartNumber, cartType, cutNumber, length, groupName, title, artist, album, publisher, composer, label, client, agency, conductor, userDefined, songId, outcue, description, isrc, isci, externalEventId, externalData, externalAnncType
  # Zrodlo: docs/opsguide/pad.xml:sect.pad.the_json_interface
  # Pewnosc: potwierdzone

Rule: Podcast item states
  Scenario: Zarzadzanie stanem itemu podcast
    Given item jest w feedzie podcast
    Then  moze miec status: Active/green (widoczny dla audience), Inactive/red (niewidoczny), Embargoed/blue (active ale tymczasowo niewidoczny)
  # Zrodlo: docs/opsguide/rdcastmanager.xml:table.rdcastmanager.rdcastmanager_item_states
  # Pewnosc: potwierdzone
```

## Ograniczenia i limity (z dokumentacji)

| Ograniczenie | Wartosc | Kontekst | Zrodlo |
|-------------|---------|----------|--------|
| Zakres numerow kart | 000001 - 999999 | Numer karty unikalny w calej bibliotece | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_carts |
| Max cutow w karcie | 999 | Kazda karta audio moze miec do 999 cutow | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cuts |
| Max portow szeregowych na host | 8 | Porty COM do komunikacji z urzadzeniami | docs/opsguide/overview.xml:sect.overview.serial_ports |
| Max dlugosci nazwy logu | 64 znaki | Alfanumeryczny unikalny identyfikator logu | docs/opsguide/rdlogedit.xml:sect.rdlogedit.logs_and_log_events |
| Log machines w RDAirPlay | 3 | Main Log (1), Aux 1 Log (2), Aux 2 Log (3); RML uzywa 0 = all | docs/opsguide/rdairplay.xml:sect.rdairplay.log_machines; rml.xml:sect.rml.log_machines |
| RML UDP port z odpowiedzia | 5858 | Odpowiedz ACK/NAK na port 5860 | docs/opsguide/rml.xml:sect.rml.command_delivery |
| RML UDP port bez odpowiedzi | 5859 | Fire and forget | docs/opsguide/rml.xml:sect.rml.command_delivery |
| PAD TCP port | 34289 | JSON padUpdate emitowany tutaj | docs/opsguide/pad.xml:sect.pad.the_json_interface |
| Timescaling | Ograniczone | Nie wszystkie adaptery audio wspieraja; sa limity ile mozna zmienic dlugosc | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_carts (Enforce Length) |
| Dropbox PathSpec | Musi zawierac czesc plikowa | Sam katalog (bez wildcard/nazwy pliku) nie matchuje niczego | docs/opsguide/rdadmin.xml:table.rdadmin.pathspec_examples |
| Dropbox import | Jednokrotny per plik | Aby ponownie przetworzyc, nalezy kliknac Reset | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox wymaga zakresu kart w grupie | Obowiazkowe | Jesli grupa nie ma ustawionego Default Cart Number lub brak wolnych numerow, dropbox rzuci error | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |

## Konfiguracja (z dokumentacji)

| Opcja | Opis | Wartosci | Zrodlo |
|-------|------|----------|--------|
| Schedule Cuts (Cart) | Sposob rotacji cutow w karcie | By Weight (default), By Specified Order | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_carts |
| Enforce Length (Cart) | Wymuszenie timescalingu w RDAirPlay | boolean; gdy on, cart gra z Forced Length zamiast natywnej dlugosci | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_carts |
| Weight (Cut) | Waga cuta do rotacji | Numerator frakcji: weight/sum_all_weights | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting |
| Air Date/Time (Cut) | Absolutny zakres dat waznosci cuta | Start datetime - End datetime; cut nie zagra poza tym zakresem | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting |
| Daypart (Cut) | Relatywny zakres godzin w ciagu dnia | Start time - End time; cut gra tylko w tym zakresie godzinowym | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting |
| Day of Week (Cut) | Dni tygodnia kiedy cut moze grac | 7 checkboxow (Mon-Sun); odznaczenie = nie gra | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting |
| Record Mode (Cut) | Tryb uruchomienia nagrywania | Manual (Play), VOX (auto na wykryciu audio) | docs/opsguide/rdlibrary.xml:sect.rdlibrary.recording_and_auditioning_a_cut_in_the_record_dialog |
| AutoTrim (Cut/Import) | Automatyczne ustawienie markerow Start/End | On/Off; ustawia na poczatek/koniec wykrytego audio | docs/opsguide/rdlibrary.xml:sect.rdlibrary.recording_and_auditioning_a_cut_in_the_record_dialog |
| Normalize (Import) | Peak normalization importowanego audio | On/Off + level w dBFS | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file |
| Channels (Import/Record) | Liczba kanalow audio | Dropdown (mono/stereo) | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file |
| Default Cart Type (Group) | Domyslny typ karty tworzonej w grupie | Audio, Macro | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Default Cart Number (Group) | Zakres numerow kart dla grupy | range start - range end | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Enforce Cart Range (Group) | Czy wymuszac zakres numerow | boolean; gdy on, karty spoza zakresu nie moga byc tworzone/przenoszone do grupy | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Set End Date/Time (Group) | Auto ustawienie daty wygasniecia nowych cutow | boolean + liczba dni od utworzenia | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Purge expired cuts (Group) | Automatyczne kasowanie wygaslych cutow | boolean + liczba dni po wygasnieciu; opcjonalnie tez kasuje pusta karte | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Include in Traffic/Music reports (Group) | Czy wlaczac do raportow | boolean per Traffic, boolean per Music | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Transmit Now & Next (Group) | Czy karty generuja PyPAD event | boolean (DEPRECATED - do usuniecia w v4.x) | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Active Services (Group) | Na jakich services karty moga grac | Lista services | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Color (Group) | Kolor wyswietlany dla grupy | Dowolny kolor | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Default Import Title (Group) | Tytul karty z dropbox/rdimport gdy brak metadanych | String z wildcards: %f (body filename), %e (extension) | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Notification E-Mail (Group) | Email na raporty importu | Adresy email oddzielone przecinkami | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Log Name Template (Service) | Szablon nazw logow generowanych przez RDLogManager | String z filepath wildcards | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_services.general |
| Voicetrack Group (Service) | Grupa do przechowywania voice trackow | Dropdown z grup | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_services.general |
| AutoSpot Group (Service) | Grupa do kart AutoSpot | Dropdown z grup | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_services.general |
| Program Code (Service) | String wysylany do PyPAD skryptow | Dowolny string | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_services.general |
| Dropbox: To Cart | Import do istniejacaej karty zamiast tworzenia nowej | Cart number; opcja "Delete cuts before importing" | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox: Metadata Pattern | Ekstrakcja tytulu z nazwy pliku | Metadata wildcards template | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox: Force to Monaural | Wymuszenie mono | boolean; mixuje kanaly w jeden | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox: Normalize Levels | Peak normalization | boolean + level w dBFS | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox: Autotrim Cuts | Autotrim | boolean + threshold w dBFS | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox: Insert Segue Markers | Auto tworzenie segue markerow | Jesli brak w metadanych: od ostatniego Segue Level przez Segue Length ms | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox: CartChunk CutID | Numer karty z metadanych pliku | boolean; karta musi byc w zakresie grupy | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox: Scheduler Codes | Przypisanie kodow schedulera | Jeden lub wiecej istniejacych scheduler codes | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Automation Mode (Log Machine) | Tryb automatyzacji | Automatic, LiveAssist, Manual | docs/opsguide/rdairplay.xml:sect.rdairplay.layout |

## Typy markerow audio

| Marker | Funkcja | Kolor | Parzyste | Zrodlo |
|--------|---------|-------|----------|--------|
| Start / End | Poczatek i koniec odtwarzanego audio | RED | Tak (zawsze obecne, nie mozna usunac) | docs/opsguide/rdlibrary.xml:table.rdlibrary.marker_types |
| TalkStart / TalkEnd | Poczatek i koniec odliczania Talk Counter w RDAirPlay | BLUE | Tak | docs/opsguide/rdlibrary.xml:table.rdlibrary.marker_types |
| SegueStart / SegueEnd | Poczatek i koniec overlap audio podczas przejsc Segue | CYAN | Tak | docs/opsguide/rdlibrary.xml:table.rdlibrary.marker_types |
| HookStart / HookEnd | "Highlighted" audio, uzywany przez button panels i RDCartSlots w Hook Mode | VIOLET | Tak | docs/opsguide/rdlibrary.xml:table.rdlibrary.marker_types |
| FadeUp | Punkt od ktorego audio robi fade up po starcie | YELLOW | Nie (pojedynczy) | docs/opsguide/rdlibrary.xml:table.rdlibrary.marker_types |
| FadeDown | Punkt od ktorego audio zaczyna fade down przed koncem | YELLOW | Nie (pojedynczy) | docs/opsguide/rdlibrary.xml:table.rdlibrary.marker_types |

## Color coding kart/cutow (playability status)

| Kolor | Znaczenie | Zrodlo |
|-------|-----------|--------|
| NO COLOR | Event zagra normalnie | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cart_and_cut_color_coding |
| CYAN | Event NIE zagra (data waznosci cuta jest w przyszlosci) | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cart_and_cut_color_coding |
| RED | Event NIE zagra (poza dayparting limits lub audio niedostepne) | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cart_and_cut_color_coding |
| GREEN | Event zagra Evergreen | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cart_and_cut_color_coding |

## Obslugiwane formaty audio (import)

| Format | Rozszerzenia | Uwagi | Zrodlo |
|--------|-------------|-------|--------|
| Microsoft WAV | *.wav | PCM16, PCM24 i MPEG | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file |
| MPEG | *.mp1, *.mp2, *.mp3 | - | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file |
| OggVorbis | *.ogg | - | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file |
| FLAC | *.flac | Free Lossless Audio Codec | docs/opsguide/rdlibrary.xml:sect2_rdlibrary_importing_audio_from_a_file |

## Obslugiwane adaptery audio

| Adapter | Opis | Zrodlo |
|---------|------|--------|
| ALSA | Standardowy sterownik Linux od 2.6.x; szerokie wsparcie kart | docs/opsguide/overview.xml:sect.overview.audio_adapters |
| HPI (AudioScience) | Karty profesjonalne do broadcast; on-board MPEG codecs, AES3 I/O | docs/opsguide/overview.xml:sect.overview.audio_adapters |
| JACK | Framework do routowania audio miedzy aplikacjami; low-latency | docs/opsguide/overview.xml:sect.overview.audio_adapters |

## Uprawnienia uzytkownikow (User rights)

| Uprawnienie | Opis | Zrodlo |
|-------------|------|--------|
| Administer System | Pelne prawa administracyjne (wylacza pozostale prawa) | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_users |
| Group Permissions | Ktore grupy uzytkownik moze widziec w RDLibrary | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_users |
| Service Permissions | Ktore services uzytkownik moze widziec w RDLogEdit | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_users |
| Podcast Feed Permissions | Ktore feedy uzytkownik moze zarzadzac w RDCastManager | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_users |

## Ostrzezenia i uwagi (edge cases z doc)

| Uwaga | Kontekst | Zrodlo |
|-------|----------|--------|
| Dayparting wplywa TYLKO na moduly on-air | W RDLibrary i innych modulach audio gra bez ograniczen daypartingu | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cut_dayparting |
| Kolor playability odnosi sie do CHWILI ogladania | Status moze sie zmienic z uplywem czasu | docs/opsguide/rdlibrary.xml:sect.rdlibrary.cart_and_cut_color_coding |
| Nagrywanie nadpisuje poprzednie audio | Ostrzezenie popup pozwala anuowac; jesli Yes, poprzednie audio jest trwale utracone | docs/opsguide/rdlibrary.xml:sect.rdlibrary.recording_and_auditioning_a_cut_in_the_record_dialog |
| Max dlugosc nagrywania ustawiana przez admina | Nagrywanie konczy sie automatycznie po przekroczeniu limitu | docs/opsguide/rdlibrary.xml:sect.rdlibrary.recording_and_auditioning_a_cut_in_the_record_dialog |
| Start/End markery nie moga byc usuniete | Zawsze obecne w kazdym cucie | docs/opsguide/rdlibrary.xml:rdlibrary.editing_markers |
| Dropbox PathSpec musi miec czesc plikowa | Sama sciezka katalogu nie matchuje plikow | docs/opsguide/rdadmin.xml:table.rdadmin.pathspec_examples |
| Dropbox import jest jednokrotny | Aby re-importowac, trzeba kliknac Reset | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Dropbox wymaga wolnego numeru karty w zakresie grupy | Bez tego dropbox rzuca error | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_dropboxes |
| Rename grupy do istniejaca grupy = merge | Karty zostana przeniesione do docelowej grupy | docs/opsguide/rdadmin.xml:rdadmin.manage_groups.renaming_groups |
| Transmit Now & Next jest DEPRECATED | Zostanie usuniete w v4.x; uzyj NowGroups/NextGroups w konfiguracji PyPAD | docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information |
| Log czerwony status != nie moze grac | Czerwony "ex" to tylko wizualny indykator niekompletnosci, log nadal moze byc odtworzony | docs/opsguide/rdlogedit.xml:sect.rdlogedit.logs_and_log_events |
| Voicetrack karty sa automatycznie zarzadzane | System sam tworzy i kasuje - operator nie musi recznie | docs/opsguide/voicetracking.xml:sect.voicetracking.voicetracking_in_rivendell |
| Move event miedzy log machines dozwolony | Mozna przeniesc event miedzy roznymi log machines | docs/opsguide/rdairplay.xml:sect.rdairplay.copying_an_event |
| RML command terminator = ! (ASCII 33) | Kazda komenda RML musi konczyc sie wykrzyknikiem | docs/opsguide/rml.xml:sect.rml.protocol |
| RML binary escape = %hexcode | Dwa znaki hex po procencie, np. %0D%0A = CR/LF | docs/opsguide/rml.xml:sect.rml.binary_data |

## Screenshoty (analiza wizualna)

### RDLibrary Main Window
Glowne okno RDLibrary pokazuje tabele kart z kolumnami: Cart number, Group, Length, Title, Artist, Start date, End date, Client, Agency, User Defined, Cuts count, Last Cut, Enforce Length, Preserve Pitch, Timescaling, Scheduler Code. U gory: filtry (Group dropdown, Scheduler Code, filtr tekstowy, Show Audio/Macro/Note/Matches Only checkboxy). Na dole: przyciski Add, Edit, Delete, Rip CD, Reports, Close oraz kontrolki odtwarzania (play/stop).

### Edit Cart Dialog
Dialog edycji karty audio. Gorna polowa: pola etykiety (Number, Group, Enforce Length, Average Length, Title, Artist, Album, Year, Label, Client, Agency, Publisher, Composer, Conductor, Song ID, User Defined, Notes). Schedule Cuts dropdown (By Weight / By Specified Order), Scheduler Codes. Dolna polowa: lista cutow z kolorowym statusem (RED = expired/unavailable, WHITE = ok), kolumny: WT, ORDER, DESCRIPTION, LENGTH, LAST PLAYED, # OF PLAYS, ORIGIN, OUTCUE, START DATE, END DATE, START DAYPART, END DAYPART, NAME, SHA1.

### Edit Marker Dialog
Waveform editor z dwoma kanalami (L/R). Gorna czesc: wyswietlenie waveform z kolorowymi markerami (RED = Start/End, BLUE = Talk, CYAN = Segue, GREEN = FadeUp/Down). Srodek: kontrolki transportu (Play from cursor, Play from start, Pause, Stop, Loop), pozycja/dlugosc, VU meter stereo. Dolna czesc: przyciski markerow z polami pozycji: Cut Start/End (RED), Trim Start/End, FadeUp/FadeDown (YELLOW), Talk Start/End (BLUE), Segue Start/End (CYAN), Hook Start/End (VIOLET). Threshold spinner (-40 dB), Cut Gain (0.0 dB), checkbox "No Fade on Segue Out", przycisk Remove Marker.
