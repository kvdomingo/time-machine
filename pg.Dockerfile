FROM bitnami/postgresql:16.2.0-debian-12-r16

ARG PG_IDKIT_VERSION=0.2.3
ARG PG_IDKIT_DIR=pg_idkit-${PG_IDKIT_VERSION}

WORKDIR /tmp

USER root

RUN apt-get update && \
    apt-get install -y --no-install-recommends wget && \
    wget --progress=dot:giga \
      https://github.com/VADOSWARE/pg_idkit/releases/download/v${PG_IDKIT_VERSION}/${PG_IDKIT_DIR}-pg16-gnu.tar.gz && \
    tar -xvf ${PG_IDKIT_DIR}-pg16-gnu.tar.gz && \
    cp ${PG_IDKIT_DIR}/lib/postgresql/* /opt/bitnami/postgresql/lib/ && \
    cp ${PG_IDKIT_DIR}/share/postgresql/extension/* /opt/bitnami/postgresql/share/extension/ && \
    apt-get remove -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER 1001

WORKDIR /
