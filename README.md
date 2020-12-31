[Project is live on Netlify](https://midas-pizza.netlify.app/)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Available Scripts

In the project directory, you can run:

### `Git submodules`

This project uses git submodules, so in order for it to work on your machine you would need to also clone the submodules into the repo.
It can be done using the `git submodule init`, and `git submodule update` commands

### `npm run serve:dev`

Before running this application, make sure to start the server using the aforementioned command

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Note
In order to run this application, you will need to have a ``.env`` file which contains
<ul>
  <li>REACT_APP_API_ENDPOINT</li>
  <li>REACT_APP_QUANTITY_LIMIT</li>
  <li>REACT_APP_STRIPE_API_KEY -- <b>This should be a publishable test key</b></li>
</ul>
