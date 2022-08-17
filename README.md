# Time Machine

A personal time-tracking web app

## Developer Onboarding


### Prerequisites
- [Docker](https://www.docker.com/get-started/)
- [Task](https://taskfile.dev/#/installation)


### Setup
1. Clone the repo on your local machine using the Git CLI.
2. Copy the contents of `.env.example` into a new file in the same directory named `.env`, and fill in the missing values. Some values will be provided to you; others you may have to generate yourself.
3. Set up [Traefik](https://doc.traefik.io/traefik/providers/docker/). Follow the instructions in the link to set up a global instance of Traefik, and name the Traefik network `gateway`. If you do not want to set up Traefik, you will have to modify `docker-compose.yml` accordingly. Ensure that you do not commit your modifications to this file.

### Running local dev env
Simply run the containers with
```shell
task
```

This will follow the logs in detached mode, so breaking (<kbd>Ctrl</kbd>/<kbd>Command</kbd> + <kbd>C</kbd>) will not stop the containers. If you need to stop the containers, run
```shell
task shutdown
```

To see the full list of tasks, run
```shell
task -l
```