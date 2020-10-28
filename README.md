# tag-gy

## Annotation interfaces

The web app lets you annotate a variety of different formats, including plain text and images. Tag-gy expects annotation tasks to follow a simple JSON-style format. This format is also used to communicate tasks between REST API and web application, and will be used when exporting annotations.

* **`POS mapping` _Annotate part-of-speech tags (manual)_**

  ```json
  {
    "text": "First look at the new MacBook Pro",
    "spans": [
      {"start": 22, "end": 33, "label": "PRODUCT", "token_start": 5, "token_end": 6}
    ],
    "tokens": [
      {"text": "First", "start": 0, "end": 5, "id": 0},
      {"text": "look", "start": 6, "end": 10, "id": 1},
      {"text": "at", "start": 11, "end": 13, "id": 2},
      {"text": "the", "start": 14, "end": 17, "id": 3},
      {"text": "new", "start": 18, "end": 21, "id": 4},
      {"text": "MacBook", "start": 22, "end": 29, "id": 5},
      {"text": "Pro", "start": 30, "end": 33, "id": 6}
    ]
  }
  ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## License
[MIT](https://choosealicense.com/licenses/mit/)
