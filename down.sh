#!/bin/bash

docker-compose down --remove-orphans
sudo docker system prune -f
