import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ApplicationWindow {
    id: root
    visible: true
    width: 1280
    height: 768
    title: "RDAirPlay"
    color: "#020617"

    // ── Design Tokens ──
    readonly property color bgPrimary:   "#020617"
    readonly property color bgSecondary: "#0F172A"
    readonly property color bgTertiary:  "#1E293B"
    readonly property color borderColor: "#334155"
    readonly property color textPrimary: "#F8FAFC"
    readonly property color textSecondary: "#CBD5E1"
    readonly property color textMuted:   "#94A3B8"
    readonly property color statusPlaying: "#22C55E"
    readonly property color statusOnAir:  "#DC2626"
    readonly property color accentPrimary: "#3B82F6"
    readonly property color statusWarning: "#F59E0B"
    readonly property color statusError:  "#EF4444"

    readonly property string fontSans: "Fira Sans"
    readonly property string fontMono: "Fira Code"

    // ── Mock State ──
    property bool onAir: true
    property string currentMode: "Automatic"
    property real pieRemaining: 0.62
    property string postPoint: "+0:12"
    property bool postAhead: true

    // ── Master Timer (100ms) ──
    Timer {
        id: masterTimer
        interval: 100
        running: true
        repeat: true
        onTriggered: {
            wallClock.text = Qt.formatTime(new Date(), "HH:mm:ss")
        }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // ══════════════════════════════════════════
        // TOP BAR
        // ══════════════════════════════════════════
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 48
            color: root.bgSecondary
            border.color: root.borderColor
            border.width: 0

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 16
                anchors.rightMargin: 16
                spacing: 16

                // Wall Clock
                Text {
                    id: wallClock
                    text: Qt.formatTime(new Date(), "HH:mm:ss")
                    font.family: root.fontMono
                    font.pixelSize: 36
                    font.weight: Font.Bold
                    color: root.textPrimary
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                    }
                }

                // Mode badge
                Rectangle {
                    implicitWidth: modeLabel.implicitWidth + 24
                    implicitHeight: 24
                    radius: 12
                    color: root.currentMode === "Automatic" ? Qt.rgba(0.13, 0.77, 0.37, 0.15) :
                           root.currentMode === "Manual"    ? Qt.rgba(0.23, 0.51, 0.93, 0.15) :
                                                              Qt.rgba(0.96, 0.62, 0.04, 0.15)
                    border.color: root.currentMode === "Automatic" ? Qt.rgba(0.13, 0.77, 0.37, 0.3) :
                                  root.currentMode === "Manual"    ? Qt.rgba(0.23, 0.51, 0.93, 0.3) :
                                                                     Qt.rgba(0.96, 0.62, 0.04, 0.3)
                    border.width: 1
                    Text {
                        id: modeLabel
                        anchors.centerIn: parent
                        text: root.currentMode.toUpperCase()
                        font.family: root.fontSans
                        font.pixelSize: 10
                        font.weight: Font.DemiBold
                        font.letterSpacing: 1.5
                        color: root.currentMode === "Automatic" ? "#4ADE80" :
                               root.currentMode === "Manual"    ? "#60A5FA" : "#FBBF24"
                    }
                }

                // ON AIR
                Rectangle {
                    visible: root.onAir
                    implicitWidth: onAirRow.implicitWidth + 16
                    implicitHeight: 24
                    radius: 4
                    color: root.statusOnAir

                    SequentialAnimation on opacity {
                        running: root.onAir
                        loops: Animation.Infinite
                        NumberAnimation { to: 0.7; duration: 1000; easing.type: Easing.InOutSine }
                        NumberAnimation { to: 1.0; duration: 1000; easing.type: Easing.InOutSine }
                    }

                    Row {
                        id: onAirRow
                        anchors.centerIn: parent
                        spacing: 6
                        Rectangle { width: 7; height: 7; radius: 3.5; color: "white"; anchors.verticalCenter: parent.verticalCenter }
                        Text {
                            text: "ON AIR"
                            font.family: root.fontSans
                            font.pixelSize: 10
                            font.weight: Font.Bold
                            font.letterSpacing: 2
                            color: "white"
                        }
                    }
                }

                // Message label
                Text {
                    Layout.fillWidth: true
                    text: "Welcome to Radio Rivendell — 98.7 FM"
                    font.family: root.fontSans
                    font.pixelSize: 13
                    font.italic: true
                    color: root.textMuted
                    elide: Text.ElideRight
                    horizontalAlignment: Text.AlignHCenter
                }

                // Next stop
                Column {
                    Layout.alignment: Qt.AlignVCenter
                    Text {
                        text: "NEXT STOP"
                        font.family: root.fontSans
                        font.pixelSize: 9
                        font.weight: Font.DemiBold
                        font.letterSpacing: 1.5
                        color: root.textMuted
                        horizontalAlignment: Text.AlignRight
                        anchors.right: parent.right
                    }
                    Text {
                        text: "15:00:00"
                        font.family: root.fontMono
                        font.pixelSize: 13
                        color: root.textSecondary
                        horizontalAlignment: Text.AlignRight
                        anchors.right: parent.right
                    }
                }
            }
        }

        // Bottom border for top bar
        Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

        // ══════════════════════════════════════════
        // MAIN AREA
        // ══════════════════════════════════════════
        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 0

            // ── LEFT: Transport Controls ──
            Rectangle {
                Layout.preferredWidth: 72
                Layout.fillHeight: true
                color: root.bgSecondary

                ColumnLayout {
                    anchors.fill: parent
                    anchors.margins: 8
                    spacing: 6

                    // Play
                    Button {
                        Layout.preferredWidth: 56; Layout.preferredHeight: 56
                        background: Rectangle { radius: 8; color: "#16A34A" }
                        contentItem: Text { text: "▶"; font.pixelSize: 24; color: "white"; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter }
                        Accessible.name: "Play"
                    }
                    // Stop
                    Button {
                        Layout.preferredWidth: 56; Layout.preferredHeight: 56
                        background: Rectangle { radius: 8; color: "#DC2626" }
                        contentItem: Text { text: "■"; font.pixelSize: 22; color: "white"; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter }
                        Accessible.name: "Stop"
                    }
                    // Pause
                    Button {
                        Layout.preferredWidth: 56; Layout.preferredHeight: 56
                        background: Rectangle { radius: 8; color: "#D97706" }
                        contentItem: Text { text: "❚❚"; font.pixelSize: 16; color: "white"; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter }
                        Accessible.name: "Pause"
                    }

                    Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

                    // Action buttons
                    Repeater {
                        model: ["Add", "Del", "Move", "Copy"]
                        Button {
                            Layout.preferredWidth: 56; Layout.preferredHeight: 32
                            background: Rectangle { radius: 4; color: root.bgTertiary }
                            contentItem: Text { text: modelData; font.family: root.fontSans; font.pixelSize: 10; font.weight: Font.DemiBold; color: root.textMuted; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter }
                            Accessible.name: modelData
                        }
                    }

                    Item { Layout.fillHeight: true }

                    // Load/Save
                    Repeater {
                        model: ["Load", "Save"]
                        Button {
                            Layout.preferredWidth: 56; Layout.preferredHeight: 28
                            background: Rectangle { radius: 4; color: Qt.rgba(0.01, 0.41, 0.63, 0.2) }
                            contentItem: Text { text: modelData; font.family: root.fontSans; font.pixelSize: 10; font.weight: Font.DemiBold; color: "#60A5FA"; horizontalAlignment: Text.AlignHCenter; verticalAlignment: Text.AlignVCenter }
                            Accessible.name: modelData
                        }
                    }
                }
            }

            Rectangle { width: 1; Layout.fillHeight: true; color: root.borderColor }

            // ── CENTER: Log List ──
            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 0

                // Tab bar
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 28
                    color: root.bgSecondary

                    Row {
                        anchors.left: parent.left; anchors.leftMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 4

                        Repeater {
                            model: ["Main Log", "Aux 1", "Aux 2", "Sound Panel"]
                            Rectangle {
                                width: tabText.implicitWidth + 20; height: 22
                                radius: index === 0 ? 4 : 4
                                color: index === 0 ? root.bgPrimary : "transparent"
                                border.color: index === 0 ? Qt.rgba(0.23, 0.51, 0.93, 0.3) : "transparent"
                                border.width: index === 0 ? 1 : 0
                                Text {
                                    id: tabText
                                    anchors.centerIn: parent
                                    text: modelData
                                    font.family: root.fontSans
                                    font.pixelSize: 11
                                    font.weight: Font.DemiBold
                                    color: index === 0 ? "#60A5FA" : root.textMuted
                                }
                                MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor }
                            }
                        }
                    }
                }
                Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

                // Column headers
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 24
                    color: root.bgTertiary

                    RowLayout {
                        anchors.fill: parent; anchors.leftMargin: 8; anchors.rightMargin: 8
                        spacing: 0
                        Text { Layout.preferredWidth: 20; text: ""; font.pixelSize: 9 }
                        Text { Layout.preferredWidth: 44; text: "LINE"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1; color: root.textMuted }
                        Text { Layout.preferredWidth: 56; text: "CART"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1; color: root.textMuted }
                        Text { Layout.fillWidth: true; text: "TITLE"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1; color: root.textMuted }
                        Text { Layout.preferredWidth: 100; text: "ARTIST"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1; color: root.textMuted }
                        Text { Layout.preferredWidth: 50; text: "LENGTH"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1; color: root.textMuted; horizontalAlignment: Text.AlignRight }
                        Text { Layout.preferredWidth: 50; text: "TRANS"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1; color: root.textMuted; horizontalAlignment: Text.AlignHCenter }
                        Text { Layout.preferredWidth: 64; text: "START"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1; color: root.textMuted; horizontalAlignment: Text.AlignRight }
                    }
                }
                Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

                // Log lines
                ListView {
                    id: logListView
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    clip: true
                    currentIndex: 0

                    model: ListModel {
                        ListElement { line: "0012"; cart: "102345"; title: "Bohemian Rhapsody";     artist: "Queen";         length: "5:55"; trans: "SEGUE"; start: "14:20:15"; status: "playing" }
                        ListElement { line: "0013"; cart: "100891"; title: "Hotel California";      artist: "Eagles";        length: "6:30"; trans: "PLAY";  start: "14:26:10"; status: "next" }
                        ListElement { line: "0014"; cart: "100204"; title: "Station ID — Radio Rivendell"; artist: "";        length: "0:08"; trans: "PLAY";  start: "14:32:40"; status: "" }
                        ListElement { line: "0015"; cart: "103782"; title: "Stairway to Heaven";    artist: "Led Zeppelin";  length: "8:02"; trans: "SEGUE"; start: "14:32:48"; status: "" }
                        ListElement { line: "0016"; cart: "100567"; title: "News Intro Jingle";     artist: "";              length: "0:05"; trans: "STOP";  start: "15:00:00"; status: "" }
                        ListElement { line: "0017"; cart: "100568"; title: "Afternoon News";        artist: "Newsroom";      length: "5:00"; trans: "PLAY";  start: "15:00:05"; status: "" }
                        ListElement { line: "0018"; cart: "104201"; title: "Come Together";          artist: "The Beatles";   length: "4:19"; trans: "SEGUE"; start: "15:05:05"; status: "" }
                        ListElement { line: "0019"; cart: "102890"; title: "Wish You Were Here";    artist: "Pink Floyd";    length: "5:34"; trans: "SEGUE"; start: "15:09:24"; status: "" }
                        ListElement { line: "0020"; cart: "100345"; title: "Weather Jingle";         artist: "";              length: "0:04"; trans: "PLAY";  start: "15:14:58"; status: "" }
                        ListElement { line: "0021"; cart: "105102"; title: "Sweet Child O' Mine";   artist: "Guns N' Roses"; length: "5:56"; trans: "SEGUE"; start: "15:15:02"; status: "" }
                    }

                    delegate: Rectangle {
                        width: logListView.width
                        height: 34
                        color: index % 2 === 0 ? root.bgPrimary : root.bgSecondary

                        // Left border indicator
                        Rectangle {
                            width: model.status === "playing" ? 4 : model.status === "next" ? 2 : 0
                            height: parent.height
                            color: model.status === "playing" ? root.statusPlaying : root.accentPrimary
                        }

                        // Hover highlight
                        Rectangle {
                            anchors.fill: parent
                            color: model.status === "playing" ? Qt.rgba(0.13, 0.77, 0.37, 0.05) :
                                   model.status === "next"    ? Qt.rgba(0.23, 0.51, 0.93, 0.05) : "transparent"
                        }

                        RowLayout {
                            anchors.fill: parent; anchors.leftMargin: 8; anchors.rightMargin: 8
                            spacing: 0

                            // Play icon
                            Item {
                                Layout.preferredWidth: 20; Layout.fillHeight: true
                                Text {
                                    anchors.centerIn: parent
                                    text: model.status === "playing" ? "▶" : ""
                                    font.pixelSize: 10
                                    color: root.statusPlaying
                                }
                            }

                            Text { Layout.preferredWidth: 44; text: model.line; font.family: root.fontMono; font.pixelSize: 11; color: model.status === "playing" ? root.textMuted : "#64748B"; verticalAlignment: Text.AlignVCenter }
                            Text { Layout.preferredWidth: 56; text: model.cart; font.family: root.fontMono; font.pixelSize: 11; color: model.status === "playing" ? root.textMuted : "#64748B"; verticalAlignment: Text.AlignVCenter }
                            Text {
                                Layout.fillWidth: true
                                text: model.title
                                font.family: root.fontSans
                                font.pixelSize: 13
                                font.weight: model.status === "playing" ? Font.Medium : Font.Normal
                                color: model.status === "playing" ? root.textPrimary : root.textSecondary
                                elide: Text.ElideRight
                                verticalAlignment: Text.AlignVCenter
                            }
                            Text { Layout.preferredWidth: 100; text: model.artist; font.family: root.fontSans; font.pixelSize: 11; color: "#64748B"; elide: Text.ElideRight; verticalAlignment: Text.AlignVCenter }
                            Text { Layout.preferredWidth: 50; text: model.length; font.family: root.fontMono; font.pixelSize: 11; color: root.textSecondary; horizontalAlignment: Text.AlignRight; verticalAlignment: Text.AlignVCenter }

                            // Transition badge
                            Item {
                                Layout.preferredWidth: 50; Layout.fillHeight: true
                                Rectangle {
                                    anchors.centerIn: parent
                                    width: transText.implicitWidth + 8; height: 16; radius: 3
                                    color: model.trans === "SEGUE" ? Qt.rgba(0.09, 0.40, 0.20, 0.6) :
                                           model.trans === "STOP"  ? Qt.rgba(0.60, 0.11, 0.11, 0.6) :
                                                                     Qt.rgba(0.12, 0.25, 0.69, 0.6)
                                    Text {
                                        id: transText; anchors.centerIn: parent
                                        text: model.trans
                                        font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.Bold
                                        color: model.trans === "SEGUE" ? "#BBF7D0" :
                                               model.trans === "STOP"  ? "#FECACA" : "#BFDBFE"
                                    }
                                }
                            }

                            Text {
                                Layout.preferredWidth: 64
                                text: model.start
                                font.family: root.fontMono; font.pixelSize: 11
                                color: model.trans === "STOP" ? root.statusWarning : "#64748B"
                                horizontalAlignment: Text.AlignRight; verticalAlignment: Text.AlignVCenter
                            }
                        }

                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor }
                    }
                }

                // Hour selector
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 26
                    color: root.bgSecondary

                    Row {
                        anchors.fill: parent; anchors.margins: 2
                        spacing: 1

                        Repeater {
                            model: 24
                            Rectangle {
                                width: (parent.width - 23) / 24; height: parent.height
                                radius: 2
                                color: index === 14 ? root.accentPrimary :
                                       (index >= 7 && index <= 18) ? Qt.rgba(0.12, 0.15, 0.23, 0.6) : root.bgTertiary

                                Text {
                                    anchors.centerIn: parent
                                    text: index.toString().padStart(2, '0')
                                    font.family: root.fontMono; font.pixelSize: 8
                                    font.weight: index === 14 ? Font.Bold : Font.Normal
                                    color: index === 14 ? "white" :
                                           (index >= 7 && index <= 18) ? root.textMuted : "#475569"
                                }

                                // Event dot
                                Rectangle {
                                    visible: index >= 7 && index <= 18 && index !== 14
                                    anchors.bottom: parent.bottom; anchors.bottomMargin: 2
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    width: 3; height: 3; radius: 1.5
                                    color: "#64748B"
                                }

                                MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor }
                            }
                        }
                    }
                }
            }

            Rectangle { width: 1; Layout.fillHeight: true; color: root.borderColor }

            // ── RIGHT: Timing + Meters ──
            Rectangle {
                Layout.preferredWidth: 200
                Layout.fillHeight: true
                color: root.bgSecondary

                ColumnLayout {
                    anchors.fill: parent
                    spacing: 0

                    // Pie Counter
                    Item {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 180
                        Layout.margins: 8

                        Canvas {
                            id: pieCanvas
                            anchors.centerIn: parent
                            width: 160; height: 160

                            onPaint: {
                                var ctx = getContext("2d")
                                var cx = width / 2, cy = height / 2, r = 62
                                ctx.clearRect(0, 0, width, height)

                                // Background ring
                                ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI)
                                ctx.lineWidth = 12; ctx.strokeStyle = root.bgTertiary; ctx.stroke()

                                // Talk region (amber, ~30% arc)
                                ctx.beginPath(); ctx.arc(cx, cy, r, -0.5 * Math.PI + 0.4 * 2 * Math.PI, -0.5 * Math.PI + 0.7 * 2 * Math.PI)
                                ctx.lineWidth = 12; ctx.strokeStyle = "rgba(245,158,11,0.25)"; ctx.stroke()

                                // Remaining (blue)
                                var endAngle = -0.5 * Math.PI + root.pieRemaining * 2 * Math.PI
                                ctx.beginPath(); ctx.arc(cx, cy, r, -0.5 * Math.PI, endAngle)
                                ctx.lineWidth = 12; ctx.strokeStyle = root.accentPrimary; ctx.stroke()
                            }

                            Component.onCompleted: requestPaint()
                        }

                        Column {
                            anchors.centerIn: parent
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "3:41"
                                font.family: root.fontMono; font.pixelSize: 32; font.weight: Font.DemiBold
                                color: root.textPrimary
                            }
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "SEGUE"
                                font.family: root.fontSans; font.pixelSize: 10; font.weight: Font.DemiBold
                                font.letterSpacing: 1
                                color: root.statusPlaying
                            }
                        }
                    }

                    Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

                    // Post Counter
                    Item {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 70
                        Layout.margins: 12

                        Column {
                            anchors.fill: parent; spacing: 4

                            Text { text: "POST POINT"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1.5; color: root.textMuted }

                            Rectangle {
                                width: parent.width; height: 36; radius: 4
                                color: root.postAhead ? Qt.rgba(0.02, 0.18, 0.09, 0.6) : Qt.rgba(0.27, 0.04, 0.04, 0.6)

                                Text {
                                    anchors.centerIn: parent
                                    text: root.postPoint
                                    font.family: root.fontMono; font.pixelSize: 22; font.weight: Font.DemiBold
                                    color: root.postAhead ? root.statusPlaying : root.statusError
                                }
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: root.postAhead ? "Ahead of schedule" : "Behind schedule"
                                font.family: root.fontSans; font.pixelSize: 9
                                color: root.postAhead ? Qt.rgba(0.13, 0.77, 0.37, 0.7) : Qt.rgba(0.94, 0.27, 0.27, 0.7)
                            }
                        }
                    }

                    Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

                    // Stop Counter
                    Item {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 50
                        Layout.margins: 12

                        Column {
                            anchors.fill: parent; spacing: 4
                            Text { text: "NEXT STOP"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1.5; color: root.textMuted }
                            Text { text: "15:00:00"; font.family: root.fontMono; font.pixelSize: 18; font.weight: Font.Medium; color: root.textSecondary; anchors.horizontalCenter: parent.horizontalCenter }
                        }
                    }

                    Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

                    // Audio Meters
                    Item {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        Layout.margins: 12

                        Column {
                            anchors.fill: parent; spacing: 6

                            Text { text: "AUDIO LEVEL"; font.family: root.fontSans; font.pixelSize: 9; font.weight: Font.DemiBold; font.letterSpacing: 1.5; color: root.textMuted }

                            Row {
                                width: parent.width
                                height: parent.height - 20
                                spacing: 8
                                anchors.horizontalCenter: parent.horizontalCenter

                                // Scale labels
                                Column {
                                    height: parent.height; width: 16
                                    Repeater {
                                        model: ["0", "-6", "-12", "-20", "-40"]
                                        Text {
                                            text: modelData; font.family: root.fontMono; font.pixelSize: 7; color: "#475569"
                                            y: index * (parent.parent.height - 10) / 4
                                        }
                                    }
                                }

                                // L meter
                                Column {
                                    width: 24; height: parent.height; spacing: 2
                                    Rectangle {
                                        width: parent.width; height: parent.height - 14; radius: 2
                                        color: root.bgTertiary
                                        clip: true

                                        Rectangle {
                                            anchors.bottom: parent.bottom; width: parent.width; radius: 2
                                            height: parent.height * 0.72
                                            gradient: Gradient {
                                                GradientStop { position: 0.0; color: root.statusError }
                                                GradientStop { position: 0.15; color: root.statusWarning }
                                                GradientStop { position: 0.4; color: root.statusPlaying }
                                                GradientStop { position: 1.0; color: root.statusPlaying }
                                            }

                                            NumberAnimation on height {
                                                running: true; loops: Animation.Infinite
                                                from: parent.height * 0.65; to: parent.height * 0.82
                                                duration: 1800; easing.type: Easing.InOutSine
                                            }
                                        }
                                    }
                                    Text { text: "L"; font.family: root.fontMono; font.pixelSize: 9; color: root.textMuted; anchors.horizontalCenter: parent.horizontalCenter }
                                }

                                // R meter
                                Column {
                                    width: 24; height: parent.height; spacing: 2
                                    Rectangle {
                                        width: parent.width; height: parent.height - 14; radius: 2
                                        color: root.bgTertiary
                                        clip: true

                                        Rectangle {
                                            anchors.bottom: parent.bottom; width: parent.width; radius: 2
                                            height: parent.height * 0.65
                                            gradient: Gradient {
                                                GradientStop { position: 0.0; color: root.statusError }
                                                GradientStop { position: 0.15; color: root.statusWarning }
                                                GradientStop { position: 0.4; color: root.statusPlaying }
                                                GradientStop { position: 1.0; color: root.statusPlaying }
                                            }

                                            NumberAnimation on height {
                                                running: true; loops: Animation.Infinite
                                                from: parent.height * 0.58; to: parent.height * 0.75
                                                duration: 2100; easing.type: Easing.InOutSine
                                            }
                                        }
                                    }
                                    Text { text: "R"; font.family: root.fontMono; font.pixelSize: 9; color: root.textMuted; anchors.horizontalCenter: parent.horizontalCenter }
                                }
                            }
                        }
                    }
                }
            }
        }

        // ══════════════════════════════════════════
        // BOTTOM: Sound Panel
        // ══════════════════════════════════════════
        Rectangle { Layout.fillWidth: true; height: 1; color: root.borderColor }

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 130
            color: root.bgSecondary

            GridLayout {
                anchors.fill: parent; anchors.margins: 6
                columns: 8; rows: 2
                rowSpacing: 4; columnSpacing: 4

                // Row 1
                Repeater {
                    model: [
                        { name: "Applause",    dur: "0:04", playing: true },
                        { name: "Rim Shot",    dur: "0:02", playing: false },
                        { name: "Sad Trombone", dur: "0:03", playing: false },
                        { name: "Air Horn",    dur: "0:02", playing: false },
                        { name: "News Sting",  dur: "0:05", playing: false },
                        { name: "Weather Bed", dur: "0:30", playing: false },
                        { name: "Station ID",  dur: "0:08", playing: false },
                        { name: "Sponsor Tag", dur: "0:15", playing: false },
                        // Row 2
                        { name: "Jingle 1",    dur: "0:06", playing: false },
                        { name: "Jingle 2",    dur: "0:07", playing: false },
                        { name: "Drop Kick",   dur: "0:01", playing: false },
                        { name: "Phone Ring",  dur: "0:03", playing: false },
                        { name: "",            dur: "",     playing: false },
                        { name: "",            dur: "",     playing: false },
                        { name: "",            dur: "",     playing: false },
                        { name: "",            dur: "",     playing: false }
                    ]

                    Rectangle {
                        Layout.fillWidth: true; Layout.fillHeight: true
                        radius: 4
                        color: modelData.playing ? "#166534" :
                               modelData.name !== "" ? root.bgTertiary : root.bgPrimary
                        border.color: modelData.playing ? Qt.rgba(0.13, 0.77, 0.37, 0.4) :
                                      modelData.name !== "" ? root.borderColor : Qt.rgba(0.12, 0.15, 0.23, 0.5)
                        border.width: modelData.playing ? 2 : 1

                        Column {
                            anchors.centerIn: parent; spacing: 2
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: modelData.name !== "" ? modelData.name : "Empty"
                                font.family: root.fontSans; font.pixelSize: 11
                                font.weight: modelData.name !== "" ? Font.Medium : Font.Normal
                                color: modelData.name !== "" ? (modelData.playing ? root.textPrimary : root.textSecondary) : "#475569"
                                elide: Text.ElideRight
                            }
                            Text {
                                visible: modelData.dur !== ""
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: modelData.dur
                                font.family: root.fontMono; font.pixelSize: 10
                                color: modelData.playing ? "#86EFAC" : root.textMuted
                            }
                        }

                        // Playing indicator dot
                        Rectangle {
                            visible: modelData.playing
                            anchors.top: parent.top; anchors.right: parent.right
                            anchors.margins: 4
                            width: 6; height: 6; radius: 3
                            color: root.statusPlaying

                            SequentialAnimation on opacity {
                                running: modelData.playing; loops: Animation.Infinite
                                NumberAnimation { to: 0.3; duration: 500 }
                                NumberAnimation { to: 1.0; duration: 500 }
                            }
                        }

                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor }
                        Accessible.name: modelData.name !== "" ? modelData.name : "Empty slot"
                    }
                }
            }
        }
    }
}
