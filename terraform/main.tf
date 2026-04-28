# terraform {
#   required_providers {
#     docker = {
#       source  = "kreuzwerker/docker"
#       version = "~> 3.0.1"
#     }
#   }
# }

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.25.0" 
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"

  registry_auth {
    # address  = "registry.hub.docker.com"
    address  = "registry-1.docker.io"
    username = var.docker_hub_username
    password = var.docker_password # Use a Personal Access Token for security
  }
}

# 1. Define the Node.js Web App Image
resource "docker_image" "webapp" {
  name = "registry-1.docker.io/${var.docker_hub_username}/kc_expressjs_web_app_img:v1"
  build {
    context    = "../"
    dockerfile = "Dockerfile.dev" # Matches your previous naming
  }
}

# 2. Define the Nginx Image
resource "docker_image" "nginx_img" {
  name = "registry-1.docker.io/${var.docker_hub_username}/nginx_web_app_img:v1"
  build {
    context    = "../"
    dockerfile = "Dockerfile.nginx"
  }
}

# 3. Create a Private Network
# Containers need to be on the same network to talk to each other by name
resource "docker_network" "app_network" {
  name = "node-app-network"
  driver   = "bridge"
  internal = false  # Restricts external access for containers on this network
  /* 
  When internal is set to true in a Docker bridge network, it restricts all external traffic to and from that network. 
  While Nginx and Express can talk to each other inside that bubble, your physical machine (the host) is considered "external." 
  Even though you mapped port 80:80, the network driver is actively dropping the connection from your host's browser, resulting in ERR_CONNECTION_REFUSED.
  Why this happened:
  - Internal Network: Acts like a sealed room. The Nginx and Node.js containers can hear each other, but the "door" to the outside world (your host machine) is locked. 
  - Standard Bridge (internal=false): Acts like a room with a window. 
  The containers are still on their own private subnet, but Docker sets up a proxy (the docker-proxy process) that allows your host to reach the "window" on port 80.
   */
}

# 4. Create the Node.js Container
resource "docker_container" "web_server" {
  name  = "expressjs_web_app" # This name is what Nginx will use in proxy_pass
  image = docker_image.webapp.image_id

  networks_advanced {
    name = docker_network.app_network.name
    aliases = ["backend", "api-internal"]
  }

  depends_on = [docker_registry_image.push_webapp]

  # Note: Internal port is 3000. We don't necessarily need to expose 
  # this to the host anymore because traffic will go through Nginx.
}

resource "docker_container" "nginx_server" {
  name  = "nginx_web_app"
  image = docker_image.nginx_img.image_id

  # We remove 'must_run' and 'wait' to stop the Terraform Plugin from crashing.
  # This allows Terraform to finish even if Nginx needs a second to stabilize.
  
  networks_advanced {
    name = docker_network.app_network.name
    aliases = ["backend", "api-internal"]
  }

  ports {
    internal = 80
    external = 80
  }

  depends_on = [docker_container.web_server, docker_registry_image.push_nginx]
}
# 6. Push Images to Registry
resource "docker_registry_image" "push_webapp" {
  name          = docker_image.webapp.name
  keep_remotely = true
}

resource "docker_registry_image" "push_nginx" {
  name          = docker_image.nginx_img.name
  keep_remotely = true
}


variable "docker_hub_username" {
  type        = string
  description = "Docker Hub username"
}

variable "docker_password" {
  type        = string
  description = "Docker Hub access password or token"
  sensitive   = true
}


