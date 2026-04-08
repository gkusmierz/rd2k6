# Extraction Gaps: CAE

## Gap 1: RTP Capture Implementation Details
- **Section:** Components and Interfaces / Audio Driver
- **Missing:** Detailed behavior of RTP capture channel operation (what happens after the channel is opened, how audio data flows from RTP to the driver, buffer management)
- **Source:** semantic-context.md mentions openRtpCaptureChannelData as a slot but provides no further detail on the RTP flow
- **Impact:** Requirement 9 has only a single acceptance criterion; implementation may need clarification

## Gap 2: JACK Session Management Details
- **Section:** System Flows
- **Missing:** Detailed JACK session setup flow (JackSessionSetup reads JACK_CLIENTS table and launches client processes, but the exact lifecycle and error handling is not fully described)
- **Source:** semantic-context.md mentions JackSessionSetup and jackClientStartData but does not provide a sequence diagram for this flow
- **Impact:** Low -- this is driver-specific behavior that will be replaced in re-implementation

## Gap 3: Meter Update Data Format
- **Section:** Components and Interfaces / Meter Publisher
- **Missing:** Exact UDP packet format for meter level updates, position updates, and output status updates
- **Source:** semantic-context.md describes SendMeterLevelUpdate, SendStreamMeterLevelUpdate, SendMeterPositionUpdate, SendMeterOutputStatusUpdate methods but not the wire format
- **Impact:** Medium -- client applications need to know the exact UDP packet structure to parse meter data

## Gap 4: Audio Ring Buffer Configuration
- **Section:** Data Models
- **Missing:** How the ring buffer (RINGBUFFER_SIZE = 262144) is used in the streaming pipeline between file I/O and audio device output
- **Source:** semantic-context.md mentions RDRingBuffer as a dependency but does not describe the data flow through it
- **Impact:** Low -- implementation detail for the driver layer
