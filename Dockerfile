FROM python:3.10-bullseye as base

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1
ENV PYTHONHASHSEED random
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on
ENV PIP_DEFAULT_TIMEOUT 100
ENV POETRY_VERSION 1.1.13
ENV VERSION $VERSION
ARG PORT

FROM base as dev

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /backend

COPY poetry.lock pyproject.toml gunicorn.conf.py ./

RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

ENV VERSION $VERSION

ENTRYPOINT ["gunicorn", "time_machine.wsgi", "-b", "0.0.0.0:5000", "-c", "./gunicorn.conf.py", "--reload"]

FROM node:16-alpine as build

WORKDIR /web

COPY ./web/app/public/ ./public/
COPY ./web/app/src/ ./src/
COPY ./web/app/package.json ./web/app/tsconfig.json ./web/app/yarn.lock ./

RUN yarn install
RUN yarn build

FROM base as prod

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /tmp

COPY poetry.lock pyproject.toml ./

RUN poetry export --without-hashes -f requirements.txt | pip install -r /dev/stdin

WORKDIR /backend

COPY ./time_machine/ ./time_machine/
COPY ./api/ ./api/
COPY ./*.py ./
COPY ./*.sh ./
COPY --from=build /web/build ./web/app/

RUN chmod +x docker-entrypoint.sh

EXPOSE $PORT

ENTRYPOINT [ "./docker-entrypoint.sh" ]
