# DraftJS Safari Crash

This projects demonstrates a crash in Safari when adding `white-space: nowrap` to an element in DraftJS. A non-nowrap example located at the top will work correctly, while the bottom one will throw an error.

## Running

1. `yarn install`
2. `yarn start`
3. Navigate to http://localhost:3000 in Safari

## Repro

1. Use Safari
2. Type a non-space character in the lower input box
3. Type a space into the lower input box

The space will be added, but when the selection state is updated, the app will crash.