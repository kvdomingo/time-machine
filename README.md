# Time Machine

One of the many UIs for the TM check in system.


### Setup
1. Clone the repo on your local machine.
2. Copy the contents of `.env.example` into a new file in the same directory named `.env`, and generate the missing values.
3. Set up [Traefik](https://doc.traefik.io/traefik/providers/docker/). Follow the instructions in the link to set up a global instance of Traefik, and name the Traefik network `gateway`. If you do not want to set up Traefik, you will have to modify `docker-compose.yml` accordingly.

### Running local server
Simply run the containers with
```shell
task -t Taskfile.prod.yml
```

This will follow the logs in detached mode, so breaking (<kbd>Ctrl</kbd>/<kbd>Command</kbd> + <kbd>C</kbd>) will not stop the containers. If you need to stop the containers, run
```shell
task -t Taskfile.prod.yml shutdown
```

To see the full list of tasks, run
```shell
task -t Taskfile.prod.yml -l
```
