#! /usr/bin/env sh

# Exit in case of error
set -e

DOMAIN=prayer.thirdavenue.org TRAEFIK_TAG=prayer.thirdavenue.org STACK_NAME=prayer-thirdavenue-org TAG=prod docker-compose -f docker-compose.shared.admin.yml -f docker-compose.shared.base-images.yml -f docker-compose.shared.depends.yml -f docker-compose.shared.env.yml -f docker-compose.deploy.command.yml -f docker-compose.deploy.images.yml -f docker-compose.deploy.labels.yml -f docker-compose.deploy.networks.yml -f docker-compose.deploy.volumes-placement.yml config > docker-stack.yml

docker stack deploy -c docker-stack.yml --with-registry-auth ${STACK_NAME}
