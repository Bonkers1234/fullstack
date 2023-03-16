```mermaid
sequenceDiagram
    participant browser
    participant server

    Note left of browser: User inputs text and submits the form
    Note left of browser: Form event handler prevents default submit action
    Note left of browser: New note is created
    Note left of browser: Notes list is updated with new note
    Note left of browser: Browser updates list with new note locally
    Note left of browser: New note is being sent to the server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: HTTP status code 201 // Created
    deactivate server

