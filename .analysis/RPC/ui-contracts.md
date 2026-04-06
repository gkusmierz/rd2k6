---
phase: 3
artifact: RPC
artifact_name: ripcd (RPC/IPC Daemon)
status: done
completed_at: 2026-04-06
ui_mode: N/A
windows_count: 0
dialogs_count: 0
widgets_count: 0
agent_version: 1.2.0
---

# UI Contracts: ripcd (RPC/IPC Daemon)

## Status: N/A (headless daemon)

ripcd jest headless daemon (QCoreApplication-equivalent -- QApplication z parametrem false = no GUI).
Nie posiada zadnych okien, dialogow, widgetow ani elementow interfejsu uzytkownika.

Jedynym interfejsem sa:
1. **Protokol RIPC** (TCP port RIPCD_TCP_PORT) -- tekstowy protokol komend
2. **Protokol RML** (UDP porty: RD_RML_ECHO_PORT, RD_RML_NOECHO_PORT, RD_RML_REPLY_PORT)
3. **Notyfikacje multicast** (RDMulticaster)
4. **Komunikacja serial** (RDTTYDevice na portach TTY)
5. **Sygnaly GPIO** (drivery Switcher emituja do MainObject)

Pelna specyfikacja protokolow TCP/UDP znajduje sie w:
- `inventory.md` -- sekcja "Protokol RIPC" i "Komendy RML"
- `call-graph.md` -- sequence diagrams protokolow (faza 4)
