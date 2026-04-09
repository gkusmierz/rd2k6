import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15
import QtQuick.Controls.Material 2.15

ApplicationWindow {
    id: root
    visible: true
    width: 1280
    height: 800
    minimumWidth: 900
    minimumHeight: 600
    title: "RDAdmin — Rivendell Administration"
    color: "#020617"

    Material.theme: Material.Dark
    Material.accent: "#3B82F6"
    Material.background: "#020617"
    Material.foreground: "#F8FAFC"

    // ── Design Tokens ──
    readonly property color bgPrimary: "#020617"
    readonly property color bgSecondary: "#0F172A"
    readonly property color bgTertiary: "#1E293B"
    readonly property color borderDefault: "#334155"
    readonly property color borderSubtle: "#1E293B"
    readonly property color textPrimary: "#F8FAFC"
    readonly property color textSecondary: "#CBD5E1"
    readonly property color textMuted: "#94A3B8"
    readonly property color accentPrimary: "#3B82F6"
    readonly property color accentHover: "#60A5FA"
    readonly property color statusOnAir: "#DC2626"
    readonly property color statusPlaying: "#22C55E"
    readonly property color statusWarning: "#F59E0B"
    readonly property color navActiveBg: "#1E293B"
    readonly property color navActiveBorder: "#3B82F6"
    readonly property color inputBg: "#0F172A"

    // ── Fonts ──
    FontLoader { id: firaSans; source: "https://fonts.gstatic.com/s/firasans/v17/va9E4kDNxMZdWfMOD5Vvl4jL.ttf" }
    FontLoader { id: firaCode; source: "https://fonts.gstatic.com/s/firacode/v22/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_A.ttf" }

    property string currentSection: "stations"
    property int currentStationTab: 1  // 0=Core, 1=App Profiles, ...
    property int currentAppProfileTab: 0  // 0=AirPlay, 1=Library, ...

    // ── Navigation Model ──
    ListModel {
        id: navModel
        ListElement { group: "SYSTEM"; label: "System Settings"; icon: "qrc:/icons/settings"; section: "settings"; count: 0 }
        ListElement { group: "SYSTEM"; label: "Scheduler Codes"; icon: "qrc:/icons/calendar"; section: "scheduler"; count: 0 }
        ListElement { group: "USERS & ACCESS"; label: "Users"; icon: "qrc:/icons/users"; section: "users"; count: 24 }
        ListElement { group: "USERS & ACCESS"; label: "Groups"; icon: "qrc:/icons/layers"; section: "groups"; count: 8 }
        ListElement { group: "BROADCAST"; label: "Services"; icon: "qrc:/icons/radio"; section: "services"; count: 0 }
        ListElement { group: "BROADCAST"; label: "Reports"; icon: "qrc:/icons/file-text"; section: "reports"; count: 0 }
        ListElement { group: "BROADCAST"; label: "Podcasts & Feeds"; icon: "qrc:/icons/rss"; section: "podcasts"; count: 0 }
        ListElement { group: "INFRASTRUCTURE"; label: "Stations"; icon: "qrc:/icons/server"; section: "stations"; count: 3 }
        ListElement { group: "INFRASTRUCTURE"; label: "Replicators"; icon: "qrc:/icons/copy"; section: "replicators"; count: 0 }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // ════════════════════════════════════════════════════
        // HEADER BAR (48px)
        // ════════════════════════════════════════════════════
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 48
            color: bgSecondary
            z: 10

            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width; height: 1
                color: borderDefault
            }

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16; anchors.rightMargin: 16
                spacing: 12

                // App Logo
                Text {
                    text: "\u2699"  // gear symbol
                    font.pixelSize: 20
                    color: accentPrimary
                }
                Text {
                    text: "RDAdmin"
                    font.pixelSize: 14
                    font.weight: Font.DemiBold
                    color: textSecondary
                }

                Item { Layout.fillWidth: true }

                // Station selector
                Text {
                    text: "Station:"
                    font.pixelSize: 12
                    color: textMuted
                }
                ComboBox {
                    model: ["MAIN-STUDIO", "PRODUCTION", "REMOTE-1"]
                    font.pixelSize: 11
                    Material.background: bgTertiary
                    implicitWidth: 140
                }

                // User avatar
                Rectangle {
                    width: 28; height: 28; radius: 14
                    color: accentPrimary
                    Text {
                        anchors.centerIn: parent
                        text: "A"
                        font.pixelSize: 12; font.bold: true
                        color: textPrimary
                    }
                }
                Column {
                    Text { text: "admin"; font.pixelSize: 11; font.weight: Font.Medium; color: textSecondary }
                    Text { text: "System Administrator"; font.pixelSize: 9; color: textMuted }
                }
            }
        }

        // ════════════════════════════════════════════════════
        // MAIN SHELL (sidebar + content)
        // ════════════════════════════════════════════════════
        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 0

            // ── SIDEBAR (240px) ──
            Rectangle {
                Layout.preferredWidth: 240
                Layout.fillHeight: true
                color: bgSecondary

                Rectangle {
                    anchors.right: parent.right
                    width: 1; height: parent.height
                    color: borderDefault
                }

                ListView {
                    anchors.fill: parent
                    anchors.topMargin: 8
                    model: navModel
                    clip: true

                    section.property: "group"
                    section.delegate: Item {
                        width: parent ? parent.width : 0
                        height: 28
                        Text {
                            anchors.left: parent.left
                            anchors.leftMargin: 12
                            anchors.verticalCenter: parent.verticalCenter
                            text: section
                            font.pixelSize: 10
                            font.weight: Font.DemiBold
                            font.letterSpacing: 1
                            font.capitalization: Font.AllUppercase
                            color: "#64748B"
                        }
                    }

                    delegate: Rectangle {
                        required property string label
                        required property string section
                        required property int count
                        required property int index

                        width: ListView.view ? ListView.view.width : 240
                        height: 36
                        color: currentSection === section ? navActiveBg : "transparent"
                        border.width: 0

                        // Active left border
                        Rectangle {
                            anchors.left: parent.left
                            width: 4; height: parent.height
                            color: currentSection === section ? navActiveBorder : "transparent"
                        }

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 16
                            anchors.rightMargin: 12
                            spacing: 10

                            // Placeholder icon (circle)
                            Rectangle {
                                width: 18; height: 18; radius: 4
                                color: "transparent"
                                border.width: 1.5
                                border.color: currentSection === section ? textPrimary : textMuted
                                Text {
                                    anchors.centerIn: parent
                                    text: label.charAt(0)
                                    font.pixelSize: 9
                                    font.bold: true
                                    color: currentSection === section ? textPrimary : textMuted
                                }
                            }

                            Text {
                                text: label
                                font.pixelSize: 13
                                font.weight: Font.Medium
                                color: currentSection === section ? textPrimary : "#94A3B8"
                                Layout.fillWidth: true
                            }

                            // Count badge
                            Rectangle {
                                visible: count > 0
                                width: countText.implicitWidth + 10
                                height: 16; radius: 8
                                color: bgTertiary
                                Text {
                                    id: countText
                                    anchors.centerIn: parent
                                    text: count
                                    font.pixelSize: 10
                                    color: textMuted
                                }
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            hoverEnabled: true
                            onClicked: currentSection = section
                            onEntered: if (currentSection !== section) parent.color = Qt.rgba(0.06, 0.09, 0.16, 0.5)
                            onExited: parent.color = currentSection === section ? navActiveBg : "transparent"
                        }
                    }
                }

                // Version footer
                Rectangle {
                    anchors.bottom: parent.bottom
                    width: parent.width; height: 32
                    color: "transparent"
                    Rectangle {
                        anchors.top: parent.top
                        width: parent.width; height: 1
                        color: borderDefault
                    }
                    Text {
                        anchors.centerIn: parent
                        text: "v2.0.0 — Rivendell"
                        font.pixelSize: 10
                        color: "#334155"
                    }
                }
            }

            // ── CONTENT AREA ──
            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 0

                // Breadcrumb bar
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 36
                    color: bgPrimary

                    Rectangle {
                        anchors.bottom: parent.bottom
                        width: parent.width; height: 1
                        color: Qt.rgba(0.2, 0.25, 0.33, 0.5)
                    }

                    Row {
                        anchors.verticalCenter: parent.verticalCenter
                        anchors.left: parent.left; anchors.leftMargin: 24
                        spacing: 6

                        Text { text: "Infrastructure"; font.pixelSize: 11; color: textMuted }
                        Text { text: ">"; font.pixelSize: 11; color: "#334155" }
                        Text { text: "Stations"; font.pixelSize: 11; color: textMuted }
                        Text { text: ">"; font.pixelSize: 11; color: "#334155" }
                        Text { text: "MAIN-STUDIO"; font.pixelSize: 11; color: textSecondary; font.weight: Font.Medium }
                        Text { text: ">"; font.pixelSize: 11; color: "#334155" }
                        Text { text: "App Profiles"; font.pixelSize: 11; color: accentPrimary; font.weight: Font.Medium }
                        Text { text: ">"; font.pixelSize: 11; color: "#334155" }
                        Text { text: "AirPlay"; font.pixelSize: 11; color: accentHover; font.weight: Font.Medium }
                    }
                }

                // Station tabs (primary)
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 36
                    color: bgSecondary

                    Rectangle {
                        anchors.bottom: parent.bottom
                        width: parent.width; height: 1
                        color: borderDefault
                    }

                    Row {
                        anchors.left: parent.left; anchors.leftMargin: 16
                        anchors.bottom: parent.bottom
                        spacing: 4

                        Repeater {
                            model: ["Core", "App Profiles", "Hardware", "Switchers", "Dropboxes", "Host Variables"]
                            delegate: Rectangle {
                                required property int index
                                required property string modelData
                                width: tabLabel.implicitWidth + 24
                                height: 30
                                color: "transparent"

                                Rectangle {
                                    anchors.bottom: parent.bottom
                                    width: parent.width; height: 2
                                    color: currentStationTab === index ? accentPrimary : "transparent"
                                }

                                Text {
                                    id: tabLabel
                                    anchors.centerIn: parent
                                    text: modelData
                                    font.pixelSize: 11
                                    font.weight: Font.Medium
                                    color: currentStationTab === index ? accentHover : textMuted
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: currentStationTab = index
                                }
                            }
                        }
                    }
                }

                // App Profile sub-tabs (secondary)
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 28
                    color: bgTertiary
                    visible: currentStationTab === 1

                    Rectangle {
                        anchors.bottom: parent.bottom
                        width: parent.width; height: 1
                        color: borderDefault
                    }

                    Row {
                        anchors.left: parent.left; anchors.leftMargin: 16
                        anchors.bottom: parent.bottom
                        spacing: 4

                        Repeater {
                            model: ["AirPlay", "Library", "Log Editor", "Panel", "Decks", "Hotkeys"]
                            delegate: Rectangle {
                                required property int index
                                required property string modelData
                                width: subTabLabel.implicitWidth + 16
                                height: 24
                                color: "transparent"

                                Rectangle {
                                    anchors.bottom: parent.bottom
                                    width: parent.width; height: 1
                                    color: currentAppProfileTab === index ? accentPrimary : "transparent"
                                }

                                Text {
                                    id: subTabLabel
                                    anchors.centerIn: parent
                                    text: modelData
                                    font.pixelSize: 10
                                    font.weight: Font.Medium
                                    color: currentAppProfileTab === index ? accentHover : textMuted
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: currentAppProfileTab = index
                                }
                            }
                        }
                    }
                }

                // ── SCROLLABLE CONTENT ──
                ScrollView {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    clip: true
                    contentWidth: availableWidth

                    Row {
                        width: parent.width

                        // ── LEFT: Form (60%) ──
                        Column {
                            width: parent.width * 0.6
                            padding: 24
                            spacing: 16

                            // Audio Configuration section
                            Text {
                                text: "AUDIO CONFIGURATION"
                                font.pixelSize: 11; font.weight: Font.DemiBold
                                font.letterSpacing: 1
                                color: textMuted
                            }

                            Grid {
                                columns: 2
                                columnSpacing: 16; rowSpacing: 12
                                width: parent.width - 48

                                // Card
                                Column {
                                    width: parent.width / 2 - 8
                                    spacing: 3
                                    Text { text: "Card *"; font.pixelSize: 11; color: "#94A3B8" }
                                    ComboBox {
                                        width: parent.width
                                        model: ["Card 0 — HPI AudioScience", "Card 1 — ALSA Default"]
                                        font.pixelSize: 12
                                        Material.background: inputBg
                                    }
                                }

                                // Port 1 Input
                                Column {
                                    width: parent.width / 2 - 8
                                    spacing: 3
                                    Text { text: "Port 1 — Input"; font.pixelSize: 11; color: "#94A3B8" }
                                    ComboBox {
                                        width: parent.width
                                        model: ["Input 0 — Analog In", "Input 1 — AES/EBU In"]
                                        font.pixelSize: 12
                                        Material.background: inputBg
                                    }
                                }
                            }

                            // Divider
                            Rectangle { width: parent.width - 48; height: 1; color: Qt.rgba(0.2, 0.25, 0.33, 0.5) }

                            // Log Machines section
                            Text {
                                text: "LOG MACHINES"
                                font.pixelSize: 11; font.weight: Font.DemiBold
                                font.letterSpacing: 1
                                color: textMuted
                            }

                            // Main Log
                            Rectangle {
                                width: parent.width - 48; height: 52
                                radius: 8; color: bgSecondary
                                border.width: 1; border.color: borderDefault

                                RowLayout {
                                    anchors.fill: parent; anchors.margins: 12
                                    spacing: 12

                                    CheckBox {
                                        checked: true
                                        Material.accent: accentPrimary
                                    }

                                    Column {
                                        Layout.fillWidth: true
                                        Text { text: "Main Log"; font.pixelSize: 13; font.weight: Font.Medium; color: textSecondary }
                                        Text { text: "Primary playout log machine"; font.pixelSize: 10; color: textMuted }
                                    }

                                    ComboBox {
                                        model: ["Card 0, Port 0"]
                                        font.pixelSize: 10
                                        Material.background: bgTertiary
                                        implicitWidth: 110
                                    }

                                    ComboBox {
                                        model: ["Mode: Auto", "Mode: Manual", "Mode: LiveAssist"]
                                        font.pixelSize: 10
                                        Material.background: bgTertiary
                                        implicitWidth: 120
                                    }
                                }
                            }

                            // Aux Log 1
                            Rectangle {
                                width: parent.width - 48; height: 52
                                radius: 8; color: bgSecondary
                                border.width: 1; border.color: borderDefault

                                RowLayout {
                                    anchors.fill: parent; anchors.margins: 12
                                    spacing: 12

                                    CheckBox {
                                        checked: true
                                        Material.accent: accentPrimary
                                    }

                                    Column {
                                        Layout.fillWidth: true
                                        Text { text: "Aux Log 1"; font.pixelSize: 13; font.weight: Font.Medium; color: textSecondary }
                                        Text { text: "Auxiliary playout machine"; font.pixelSize: 10; color: textMuted }
                                    }

                                    ComboBox {
                                        model: ["Card 0, Port 1"]
                                        font.pixelSize: 10
                                        Material.background: bgTertiary
                                        implicitWidth: 110
                                    }

                                    ComboBox {
                                        model: ["Mode: Manual"]
                                        font.pixelSize: 10
                                        Material.background: bgTertiary
                                        implicitWidth: 120
                                    }
                                }
                            }

                            // Divider
                            Rectangle { width: parent.width - 48; height: 1; color: Qt.rgba(0.2, 0.25, 0.33, 0.5) }

                            // Visual & Behavior
                            Text {
                                text: "VISUAL & BEHAVIOR"
                                font.pixelSize: 11; font.weight: Font.DemiBold
                                font.letterSpacing: 1
                                color: textMuted
                            }

                            Grid {
                                columns: 2
                                columnSpacing: 16; rowSpacing: 12
                                width: parent.width - 48

                                Column {
                                    width: parent.width / 2 - 8
                                    spacing: 3
                                    Text { text: "Skin"; font.pixelSize: 11; color: "#94A3B8" }
                                    ComboBox {
                                        width: parent.width
                                        model: ["Default Dark", "Classic Blue", "High Contrast"]
                                        font.pixelSize: 12
                                        Material.background: inputBg
                                    }
                                }

                                Column {
                                    width: parent.width / 2 - 8
                                    spacing: 3
                                    Text { text: "Segue Length (ms)"; font.pixelSize: 11; color: "#94A3B8" }
                                    TextField {
                                        width: parent.width
                                        text: "250"
                                        font.pixelSize: 12
                                        font.family: firaCode.name
                                        Material.background: inputBg
                                    }
                                }
                            }

                            // Save/Cancel bar
                            Rectangle { width: parent.width - 48; height: 1; color: Qt.rgba(0.2, 0.25, 0.33, 0.5) }

                            RowLayout {
                                width: parent.width - 48
                                spacing: 12

                                // Unsaved indicator
                                Row {
                                    spacing: 6
                                    Rectangle { width: 6; height: 6; radius: 3; color: statusWarning; anchors.verticalCenter: parent.verticalCenter }
                                    Text { text: "Unsaved changes"; font.pixelSize: 11; color: statusWarning }
                                }

                                Item { Layout.fillWidth: true }

                                Button {
                                    text: "Cancel"
                                    flat: true
                                    font.pixelSize: 12
                                    Material.foreground: textMuted
                                }
                                Button {
                                    text: "Save Changes"
                                    font.pixelSize: 12
                                    Material.background: accentPrimary
                                    Material.foreground: textPrimary
                                }
                            }
                        }

                        // ── RIGHT: Mini Playout Preview (40%) ──
                        Column {
                            width: parent.width * 0.4
                            padding: 24
                            spacing: 12

                            Text {
                                text: "LIVE PREVIEW — PLAYOUT LAYOUT"
                                font.pixelSize: 11; font.weight: Font.DemiBold
                                font.letterSpacing: 1
                                color: textMuted
                            }

                            Text {
                                text: "Read-only preview showing how settings map to the playout interface"
                                font.pixelSize: 10; color: "#334155"
                                width: parent.width - 48
                                wrapMode: Text.WordWrap
                            }

                            // Mini Playout Window
                            Rectangle {
                                width: parent.width - 48
                                height: 260
                                radius: 8
                                color: bgPrimary
                                border.width: 1; border.color: borderDefault

                                Column {
                                    anchors.fill: parent
                                    spacing: 0

                                    // Mini top bar
                                    Rectangle {
                                        width: parent.width; height: 24
                                        color: bgSecondary
                                        radius: 8

                                        // Flatten bottom corners
                                        Rectangle {
                                            anchors.bottom: parent.bottom
                                            width: parent.width; height: 8
                                            color: bgSecondary
                                        }

                                        Rectangle {
                                            anchors.bottom: parent.bottom
                                            width: parent.width; height: 1
                                            color: borderDefault
                                        }

                                        Row {
                                            anchors.verticalCenter: parent.verticalCenter
                                            anchors.left: parent.left; anchors.leftMargin: 8
                                            spacing: 6

                                            Text {
                                                text: "14:23:07"
                                                font.pixelSize: 10; font.bold: true
                                                font.family: firaCode.name
                                                color: textSecondary
                                            }

                                            Rectangle {
                                                width: 32; height: 14; radius: 7
                                                color: Qt.rgba(0.13, 0.77, 0.37, 0.2)
                                                border.width: 1; border.color: Qt.rgba(0.13, 0.77, 0.37, 0.3)
                                                Text {
                                                    anchors.centerIn: parent
                                                    text: "AUTO"; font.pixelSize: 7; font.bold: true
                                                    color: "#4ADE80"
                                                }
                                            }

                                            Rectangle {
                                                width: 40; height: 14; radius: 3
                                                color: statusOnAir
                                                Row {
                                                    anchors.centerIn: parent; spacing: 3
                                                    Rectangle { width: 4; height: 4; radius: 2; color: "white"; anchors.verticalCenter: parent.verticalCenter }
                                                    Text { text: "ON AIR"; font.pixelSize: 6; font.bold: true; color: "white" }
                                                }
                                            }
                                        }
                                    }

                                    // Mini main content (log list + timing)
                                    Row {
                                        width: parent.width
                                        height: parent.height - 24 - 48

                                        // Mini transport
                                        Rectangle {
                                            width: 24; height: parent.height
                                            color: bgSecondary

                                            Column {
                                                anchors.centerIn: parent; spacing: 3
                                                Rectangle { width: 16; height: 16; radius: 3; color: statusPlaying }
                                                Rectangle { width: 16; height: 16; radius: 3; color: statusOnAir }
                                                Rectangle { width: 16; height: 16; radius: 3; color: statusWarning }
                                            }
                                        }

                                        // Mini log list
                                        Column {
                                            width: parent.width - 24 - 56
                                            height: parent.height
                                            clip: true

                                            Repeater {
                                                model: [
                                                    "Bohemian Rhapsody|5:55",
                                                    "Hotel California|6:30",
                                                    "Station ID|0:08",
                                                    "Stairway to Heaven|8:02",
                                                    "News Intro Jingle|0:05",
                                                    "Afternoon News|5:00",
                                                    "Come Together|4:19"
                                                ]
                                                delegate: Rectangle {
                                                    required property string modelData
                                                    required property int index
                                                    width: parent.width; height: 16
                                                    color: index % 2 === 0 ? bgPrimary : bgSecondary

                                                    Rectangle {
                                                        anchors.left: parent.left
                                                        width: index === 0 ? 2 : (index === 1 ? 1 : 0)
                                                        height: parent.height
                                                        color: index === 0 ? statusPlaying : accentPrimary
                                                    }

                                                    Row {
                                                        anchors.fill: parent; anchors.leftMargin: 4
                                                        spacing: 4

                                                        Text {
                                                            width: parent.width - 30
                                                            text: modelData.split("|")[0]
                                                            font.pixelSize: 7
                                                            color: index < 2 ? textSecondary : textMuted
                                                            elide: Text.ElideRight
                                                            anchors.verticalCenter: parent.verticalCenter
                                                        }
                                                        Text {
                                                            text: modelData.split("|")[1]
                                                            font.pixelSize: 7
                                                            font.family: firaCode.name
                                                            color: textMuted
                                                            anchors.verticalCenter: parent.verticalCenter
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        // Mini timing panel
                                        Rectangle {
                                            width: 56; height: parent.height
                                            color: bgSecondary
                                            border.width: 1; border.color: borderDefault

                                            Column {
                                                anchors.centerIn: parent; spacing: 6

                                                // Mini pie (simplified)
                                                Rectangle {
                                                    width: 40; height: 40; radius: 20
                                                    color: bgTertiary
                                                    border.width: 4; border.color: accentPrimary

                                                    Text {
                                                        anchors.centerIn: parent
                                                        text: "3:41"
                                                        font.pixelSize: 8; font.bold: true
                                                        font.family: firaCode.name
                                                        color: textSecondary
                                                    }
                                                }

                                                // Mini post
                                                Rectangle {
                                                    width: 36; height: 14; radius: 3
                                                    color: Qt.rgba(0.02, 0.18, 0.08, 0.4)
                                                    Text {
                                                        anchors.centerIn: parent
                                                        text: "+0:12"
                                                        font.pixelSize: 7
                                                        font.family: firaCode.name
                                                        color: statusPlaying
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // Mini sound panel
                                    Rectangle {
                                        width: parent.width; height: 48
                                        color: bgSecondary
                                        radius: 8

                                        // Flatten top corners
                                        Rectangle {
                                            anchors.top: parent.top
                                            width: parent.width; height: 8
                                            color: bgSecondary
                                        }

                                        Rectangle {
                                            anchors.top: parent.top
                                            width: parent.width; height: 1
                                            color: borderDefault
                                        }

                                        Grid {
                                            anchors.fill: parent
                                            anchors.margins: 3
                                            columns: 8; rows: 2
                                            spacing: 2

                                            Repeater {
                                                model: ["Applause", "Rim Shot", "Trombone", "Air Horn",
                                                        "News", "Weather", "ID", "Sponsor",
                                                        "Jingle 1", "Jingle 2", "Drop", "Phone",
                                                        "", "", "", ""]
                                                delegate: Rectangle {
                                                    required property string modelData
                                                    required property int index
                                                    width: (parent.width - 14) / 8
                                                    height: (parent.height - 2) / 2
                                                    radius: 2
                                                    color: index === 0 ? "#166534" : (modelData === "" ? bgPrimary : bgTertiary)
                                                    border.width: index === 0 ? 1 : (modelData === "" ? 1 : 1)
                                                    border.color: index === 0 ? Qt.rgba(0.13, 0.77, 0.37, 0.4) : (modelData === "" ? Qt.rgba(0.12, 0.16, 0.23, 0.5) : borderDefault)

                                                    Text {
                                                        anchors.centerIn: parent
                                                        text: modelData || ""
                                                        font.pixelSize: 5
                                                        color: modelData ? textMuted : "transparent"
                                                        elide: Text.ElideRight
                                                        width: parent.width - 4
                                                        horizontalAlignment: Text.AlignHCenter
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            Text {
                                text: "Preview reflects the airplay playout layout for station MAIN-STUDIO"
                                font.pixelSize: 9; color: "#334155"
                                width: parent.width - 48
                                horizontalAlignment: Text.AlignHCenter
                            }

                            // Configuration Summary
                            Rectangle {
                                width: parent.width - 48; height: summaryCol.height + 24
                                radius: 8; color: bgSecondary
                                border.width: 1; border.color: borderDefault

                                Column {
                                    id: summaryCol
                                    anchors.left: parent.left; anchors.right: parent.right
                                    anchors.top: parent.top
                                    anchors.margins: 12
                                    spacing: 6

                                    Text {
                                        text: "CONFIGURATION SUMMARY"
                                        font.pixelSize: 10; font.weight: Font.DemiBold
                                        font.letterSpacing: 1; color: textMuted
                                    }

                                    Repeater {
                                        model: [
                                            "Audio Card|Card 0 — HPI",
                                            "Log Machines|2 active (Main, Aux 1)",
                                            "Sound Panel|8 x 2 grid",
                                            "Skin|Default Dark",
                                            "Start Mode|Previous",
                                            "Segue Length|250ms",
                                            "GPIO Channels|2 of 3 assigned"
                                        ]
                                        delegate: Row {
                                            required property string modelData
                                            width: summaryCol.width
                                            Text {
                                                width: parent.width * 0.4
                                                text: modelData.split("|")[0]
                                                font.pixelSize: 10; color: textMuted
                                            }
                                            Text {
                                                text: modelData.split("|")[1]
                                                font.pixelSize: 10; color: textSecondary
                                                font.family: modelData.split("|")[1].match(/\d/) ? firaCode.name : firaSans.name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
