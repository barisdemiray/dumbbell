# bundled

A simpler (and I mean it) clone of bundlephobia.com. It helps to figure out possible overhead of an NPM package install.

It is composed of a frontend and a backend. Frontend lets the user to enter then name of the package. Backend then does the following below for 3 last versions of the current major version, and the last version of the previous major version.

- Install the package in a temporary environment
- Create the bundle of the package using `webpack`
- Minify the bundle using `minify`
- Gzip the minified bundle using `gzip`
- Retrieve file size of the result file

Result is reported on the frontend like below.

## Design

Backend is a Node.js application that uses the built-in `http` to create a simple web server. Then, mostly using the module `execa` it carries out the tasks listed above and sends back information to frontend.

Frontend is a React application based on a `create-react-app` boilerplate. It is designed to have a basic functionality with proper error reporting and visual feedbacks for a moderate user experience.

Frontend components are as below.

![Frontend Components](/doc/frontend.png)

## Prerequisites

This project has following dependencies.

- Node.js (Backend)

```shell
sudo apt-get install -y nodejs
```

- minify (Backend)

```shell
yarn global add minify
```

- Yarn or NPM (Frontend and Backend)

```shell
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update
sudo apt install yarn

```

- Gzip (Backend)

```shell
sudo apt-get install -y gzip
```

## Preparation

First of all, the dependencies of both frontend and backend have to be installed.

```shell
pushd backend
yarn install
popd

pushd frontend
yarn install
popd
```

## Running

There is a helper `gulp` configuration that launches both backend and frontend.

```shell
gulp start
```

If not, they can be run manually as shown below.

First run the backend.

```shell
cd backend
node index.js
```

Then the frontend.

```shell
cd frontend
yarn start
```

## Testing

There is a helper `gulp` configuration that launches unit tests for both backend and frontend.

```shell
gulp test
```

If not, they can be run manually as shown below.

To run the backend tests.

```shell
cd backend
yarn test [--coverage]
```

Then the frontend. Here we need a large-enough timeout as we wait for DOM elements to appear following events fired.

```shell
cd frontend
yarn test --watchAll=false --testTimeout=30000 [--coverage]
```

## Notes

For paths of improvement, see [Issues](https://github.com/barisdemiray/bundled/issues).
