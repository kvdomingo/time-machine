# TimingMachine: A personal time-tracking web app
![TimingMachine](https://raw.githubusercontent.com/kvdomingo/time-machine/master/frontend/static/frontend/images/logo.png?token=AI7UNTDK33VD3TYB6TXLDVK6Z3BDE)


## Getting started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
- [Python](https://python.org/downloads) 3.6+
- [Node.js](https://nodejs.org/en/) 10+
- [Git](https://git-scm.com/)

### Installing
A step by step series of examples that tell you how to get a development env running

1. Install Git, Python, and Node.js (links above).
2. Install and update Python package manager (`pip`) and virtualenv.
```shell
> python -m pip install -U pip virtualenv
```
3. Clone and extract repository to your machine
```shell
> git clone https://github.com/kvdomingo/time-machine.git
```
4. Checkout a new `develop` branch. Do not make any modifications directly in the `master` branch. Similarly, do not push directly to the `master` branch.
```shell
> git checkout -b develop
```
5. `cd` to repo folder and create a new virtualenv
```shell
> python -m venv env
```
6. Activate virtualenv
```shell
# Linux/macOS
> source env/bin/activate
# Windows
> .\env\Scripts\activate
```
7. Install remaining prerequisites
```shell
> pip install -r requirements.txt
> npm i
```

### Deploying locally
```shell
> python manage.py runserver
```

Access the local server at `http://localhost:8000`.

### Running the tests
```shell
> python manage.py test
```

## Deployment
```shell
> git add .
> git commit -m <DESCRIPTIVE_COMMIT_MESSAGE>
> git push origin <GITHUB_BRANCH>
```
where `GITHUB_BRANCH` should reflect the type of changes you are implementing (e.g., `feature/some-amazing-new-feature`, `bugfix/crush-critical-bug`). Open a PR once the changes are ready to be merged into the `master` branch.

## Contributing
Email us :)

## Authors
- **Kenneth V. Domingo** - [Email](mailto:hello@kvdomingo.xyz) | [Website](https://kvdomingo.xyz) | [GitHub](https://github.com/kvdomingo)
