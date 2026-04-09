"""Domain models for Rivendell cart-based data migration."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, date, time
from enum import IntEnum, Enum
from typing import Optional


class CartType(IntEnum):
    AUDIO = 1
    MACRO = 2


class CodingFormat(IntEnum):
    PCM_WAV = 0
    MPEG_L2 = 1
    MPEG_L3 = 2
    FLAC = 4
    OGG = 5


class TimeType(IntEnum):
    RELATIVE = 0
    HARD = 1
    INITIAL = 2


class TransType(IntEnum):
    PLAY = 0
    SEGUE = 1
    STOP = 2


class LogLineType(IntEnum):
    CART = 0
    MARKER = 1
    MACRO = 2
    OPEN_BRACKET = 3
    CLOSE_BRACKET = 4
    CHAIN = 5
    TRACK = 6
    MUS_LINK = 7
    TFC_LINK = 8


@dataclass
class Group:
    name: str
    description: str = ""
    default_cart_type: CartType = CartType.AUDIO
    default_low_cart: int = 0
    default_high_cart: int = 0
    color: Optional[str] = None


@dataclass
class CuePoints:
    start_point: int = -1      # ms, trim start
    end_point: int = -1        # ms, trim end
    fadeup_point: int = -1     # ms, fade-in end
    fadedown_point: int = -1   # ms, fade-out start
    segue_start_point: int = -1  # ms, segue trigger
    segue_end_point: int = -1  # ms, segue end
    hook_start_point: int = -1 # ms, hook start
    hook_end_point: int = -1   # ms, hook end
    talk_start_point: int = -1 # ms, talk-over start
    talk_end_point: int = -1   # ms, talk-over end


@dataclass
class Cut:
    cut_name: str              # Format: NNNNNN_NNN (cart_number + cut index)
    cart_number: int
    description: str = ""
    outcue: str = ""
    isrc: str = ""
    length: int = 0            # ms
    origin_datetime: Optional[datetime] = None
    origin_name: str = ""
    weight: int = 1
    play_counter: int = 0
    coding_format: CodingFormat = CodingFormat.PCM_WAV
    sample_rate: int = 44100
    bit_rate: int = 0
    channels: int = 2
    play_gain: int = 0         # centidB (dB * 100)
    cue_points: CuePoints = field(default_factory=CuePoints)
    source_file_path: Optional[str] = None  # original file path for media copy


@dataclass
class Cart:
    number: int
    type: CartType = CartType.AUDIO
    group_name: str = ""
    title: str = ""
    artist: str = ""
    album: str = ""
    year: Optional[date] = None
    composer: str = ""
    publisher: str = ""
    song_id: str = ""
    bpm: int = 0
    average_length: int = 0    # ms
    cut_quantity: int = 1
    sched_codes: str = ""
    notes: str = ""
    metadata_datetime: Optional[datetime] = None
    cuts: list[Cut] = field(default_factory=list)
    _source_idx: Optional[int] = None  # internal: source system item index


@dataclass
class LogLine:
    line_id: int = -1
    count: int = 0
    cart_number: int = 0
    start_time: int = -1       # ms from midnight
    time_type: TimeType = TimeType.RELATIVE
    trans_type: TransType = TransType.PLAY
    type: LogLineType = LogLineType.CART
    comment: str = ""
    label: str = ""


@dataclass
class Log:
    name: str
    service: str = ""
    description: str = ""
    origin_user: str = ""
    origin_datetime: Optional[datetime] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    lines: list[LogLine] = field(default_factory=list)


@dataclass
class ElrLine:
    """Event Log Reconciliation line — actual playback record."""
    service_name: str = ""
    log_name: str = ""
    cart_number: int = 0
    cut_number: int = 0
    title: str = ""
    artist: str = ""
    start_datetime: Optional[datetime] = None
    length: int = 0  # ms
    station_name: str = ""


@dataclass
class VoiceTrack:
    """Extracted voicetrack reference from MairList playlist XML."""
    filename: str              # e.g. VoiceTrack-{UUID}.wav
    title: str = ""
    duration: float = 0.0      # seconds
    start_next: float = -1.0   # seconds, segue marker
    playlist_slot: Optional[datetime] = None
    playlist_pos: int = 0


@dataclass
class MigrationRecord:
    """Tracks source→target mapping for migration."""
    source_system: str
    source_id: str
    source_external_id: str = ""
    target_cart_number: Optional[int] = None
    target_cut_name: str = ""
    status: str = "pending"
    notes: str = ""
