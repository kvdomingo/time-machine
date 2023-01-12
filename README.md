# Time Machine

One of the many UIs for the TM checkin system.

### Setup
1. Clone the repo.
2. Download [Task](https://taskfile.dev/installation/) and add to your `PATH`.
2. Copy the contents of `.env.example` into a new file in `/deploy/prod` named `.env`, and generate the missing values.
3. Set up [Traefik](https://doc.traefik.io/traefik/providers/docker/). Follow the instructions in the link to set up a global instance of Traefik, and name the Traefik network `gateway`. This will allow you to
 access the app as `time-machine.localhost`. If you do not have or do not want to set up Traefik, 
 you will have to modify `deploy/prod/docker-compose.yml` accordingly:
    - Remove the entire `labels` & `networks` sections under the `proxy` service.
    - Add the following under the `proxy` service (without the angled brackets):
      ```yaml
      ports:
        - <YOUR_DESIRED_PORT>:8001
      ```
    - Remove the top-level `networks`.

### Running local server
To run the containers or update them after pulling an update:
```shell
task -t Taskfile.prod.yml
```

Access the app in a browser through `time-machine.localhost` or `localhost:<YOUR_DESIRED_PORT>`, depending
on what you did in Step 4.

This will follow the logs detached, so breaking (<kbd>Ctrl</kbd>/<kbd>Command</kbd> + <kbd>C</kbd>) will not stop the containers. The containers will automatically run on startup, assuming your Docker
 installation is also set to run on startup. If you need to stop the containers, run
```shell
task -t Taskfile.prod.yml shutdown
```

To see the full list of tasks, run
```shell
task -t Taskfile.prod.yml -l
```
