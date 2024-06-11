Small bugs:

- [ ] save button shoulld be disabled when the current image is already saved

Small features:

- [ ] add a preview to see what's on the watch screen
  - [ ] make visibility of this preview toggleable
- [ ] /control's "save all" button not implemented
- [ ] /control's "clear all" button not implemented
- [ ] prompt the user when loading `/draw` to enter a name

Advanced bug:

- [ ] clear requires the client to be connected

Advanced features:

- [ ] connectivity status not reflected

# EPiQ (Epic Pub Interactive Quiz)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This is a scrappy app for a scrappy gameshow - contestants draw / write in answers on their phone via `/draw`. Production staff will then choose which image to show on the `/watch` screen.

## Setup & Running

```sh
npm start # run the server

npm install -g tsx
cd src/server
tsx watch index.ts # run the server, restart on save
```

## URLs

- [http://localhost:3000/](http://localhost:3000)
  - home URL, just links to other pages
- [http://localhost:3000/control](http://localhost:3000) Control panel
  - see all connected drawers and their latest drawings
  - save drawings to show later
  - select a drawing to show on the TV screen
- [http://localhost:3000/draw](http://localhost:3000/draw) Draw
- [http://localhost:3000/watch](http://localhost:3000/watch) Watch/TV display

The page will reload if you make edits.
You will also see any lint errors in the console.
