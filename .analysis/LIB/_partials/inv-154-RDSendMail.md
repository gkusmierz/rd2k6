---
partial_id: 154
artifact: LIB
class_name: RDSendMail
header_file: lib/rdsendmail.h
source_file: lib/rdsendmail.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDSendMail

## Typ Qt
Plain C++ (Utility — static methods)

## Odpowiedzialność (WHAT)
Wysyłanie emaili przez SMTP — statyczna metoda send() buduje wiadomość MIME i wywołuje /usr/sbin/sendmail lub konfigurowalny MTA.

## Publiczne API
| Metoda | Efekt |
|--------|-------|
| RDSendMail::send(from, to, bcc, subject, body, &err) | Wyślij email |

## Linux-specific
| Komponent | Użycie | Priorytet |
|-----------|--------|-----------|
| /usr/sbin/sendmail | MTA | HIGH |

## Zależności
QProcess (wywołanie sendmail)
