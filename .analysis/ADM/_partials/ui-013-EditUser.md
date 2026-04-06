---
partial_id: "013"
artifact: ADM
window_name: "RDAdmin - User: {username}"
class_name: EditUser
ui_source: code
ui_file: null
screenshot: docs/opsguide/rdadmin.user_dialog.png
mockup: mockups/EditUser.html
window_type: Dialog
phase: 3
status: done
---

# UI Contract: Edit User

## Identyfikacja
| Pole | Wartość |
|------|---------|
| Klasa | EditUser |
| Typ | Dialog |
| Tytuł okna | RDAdmin - User: {username} |
| Modalność | modal (implicit) |
| Rodzic | ListUsers / AddUser |
| Rozmiar | 375x723 (fixed) |

## Źródła ekstrakcji
| Źródło | Status | Plik |
|--------|--------|------|
| Kod C++ | ✅ | rdadmin/edit_user.cpp |
| Plik .ui | N/A | N/A |
| Plik .qml | N/A | N/A |
| Screenshot | ✅ | docs/opsguide/rdadmin.user_dialog.png |
| Mockup HTML | ✅ | mockups/EditUser.html |

## Dane wejściowe
| Dane | Typ | Źródło | Wymagane |
|------|-----|--------|----------|
| user | QString (login name) | konstruktor arg | tak |

## Widgety i interakcje
| Widget (name) | Typ Qt | Etykieta | Akcja | Slot |
|---------------|--------|----------|-------|------|
| user_name_edit | QLineEdit | &User Name: | readonly, maxLength=191 | - |
| user_full_name_edit | QLineEdit | &Full Name: | edycja, maxLength=191 | - |
| user_description_edit | QLineEdit | &Description: | edycja, maxLength=191 | - |
| user_email_address_edit | QLineEdit | E-Mail Address: | edycja, maxLength=191 | - |
| user_phone_edit | QLineEdit | &Phone: | edycja, maxLength=20 | - |
| user_localauth_check | QCheckBox | Authenticate This User Locally | toggle auth mode | localAuthToggledData(bool) |
| user_pamservice_edit | QLineEdit | PAM Service: | edycja, maxLength=32 | - |
| user_password_button | QPushButton | Change Password | otwiera RDPasswd dialog | passwordData() |
| user_webapi_auth_spin | QSpinBox | WebAPI Timeout: | 0-86400, special="Disabled" | - |
| user_admin_config_button | QCheckBox | Administer System | toggle admin priv | adminConfigToggledData(bool) |
| user_admin_rss_button | QCheckBox | Administer RSS Feeds | toggle RSS admin priv | adminRssToggledData(bool) |
| user_create_carts_button | QCheckBox | Create Carts | - | - |
| user_delete_carts_button | QCheckBox | Delete Carts | - | - |
| user_modify_carts_button | QCheckBox | Modify Carts | - | - |
| user_edit_audio_button | QCheckBox | Edit Audio | - | - |
| user_webget_login_button | QCheckBox | Allow WebGet Login | - | - |
| user_edit_catches_button | QCheckBox | Edit Netcatch Schedule | - | - |
| user_voicetrack_log_button | QCheckBox | Voicetrack Logs | - | - |
| user_create_log_button | QCheckBox | Create Log | - | - |
| user_delete_log_button | QCheckBox | Delete Log | - | - |
| user_delete_rec_button | QCheckBox | Delete Report Data | - | - |
| user_modify_template_button | QCheckBox | Modify Template | - | - |
| user_playout_log_button | QCheckBox | Playout Logs | - | - |
| user_arrange_log_button | QCheckBox | Rearrange Log Items | - | - |
| user_addto_log_button | QCheckBox | Add Log Items | - | - |
| user_removefrom_log_button | QCheckBox | Delete Log Items | - | - |
| user_config_panels_button | QCheckBox | Configure System Panels | - | - |
| user_add_podcast_button | QCheckBox | Create Podcast | - | - |
| user_edit_podcast_button | QCheckBox | Edit Podcast | - | - |
| user_delete_podcast_button | QCheckBox | Delete Podcast | - | - |
| user_web_box | QCheckBox | Allow Web Login | - | - |
| user_assign_perms_button | QPushButton | Group Permissions | otwiera EditUserPerms | groupsData() |
| user_assign_svcs_button | QPushButton | Service Permissions | otwiera EditUserServicePerms | servicesData() |
| user_assign_feeds_button | QPushButton | Podcast Feed Permissions | otwiera EditFeedPerms | feedsData() |
| ok_button | QPushButton | &OK | zapisuje i zamyka | okData() |
| cancel_button | QPushButton | &Cancel | anuluje | cancelData() |

### Grupy QGroupBox
| Grupa | Etykieta | Zawiera |
|-------|----------|---------|
| user_admin_group | Administrative Rights | admin_config, admin_rss |
| user_prod_group | Production Rights | create/delete/modify carts, edit audio, webget login, edit catches, voicetrack |
| user_traffic_group | Traffic Rights | create/delete log, delete rec, modify template |
| user_onair_group | OnAir Rights | playout/arrange/addto/removefrom log, config panels |
| user_podcast_group | Podcasting Rights | add/edit/delete podcast, web login |

## Stany widoku
| Stan | Kiedy | Co widzi użytkownik | Disabled/Hidden |
|------|-------|---------------------|----------------|
| Admin Config ON | user_admin_config_button checked | wszystkie prawa prod/traffic/onair/podcast disabled, perms buttons disabled | admin_rss disabled |
| Admin RSS ON | user_admin_rss_button checked | j.w. | admin_config disabled |
| Local Auth ON | user_localauth_check checked | password button enabled, PAM service disabled | - |
| Local Auth OFF | user_localauth_check unchecked | password button disabled, PAM service enabled | - |
| Self-edit | edytujemy siebie (user==rda->user) | admin_config checkbox+label disabled | nie można się zdegradować |

## Walidacje UI
| Pole | Reguła | Komunikat | Kiedy | Źródło |
|------|--------|-----------|-------|--------|
| - | RDTextValidator na polach tekstowych | - | inline | validator |

## Nawigacja
| Skąd | Jak | Co przekazuje |
|------|-----|---------------|
| ListUsers / AddUser | edit / double-click / po dodaniu | username |
| EditUser → EditUserPerms | przycisk Group Permissions | RDUser* |
| EditUser → EditUserServicePerms | przycisk Service Permissions | RDUser* |
| EditUser → EditFeedPerms | przycisk Podcast Feed Permissions | RDUser* |
| EditUser → RDPasswd | przycisk Change Password | QString* password |

## Rozbieżności screenshot ↔ kod
| Element | Na screenshot | W kodzie | Uwagi |
|---------|--------------|----------|-------|
| - | - | - | Screenshot odpowiada kodowi |
