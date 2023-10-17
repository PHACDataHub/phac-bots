FROM mcr.microsoft.com/devcontainers/rust:1-1-bullseye AS ulid_tool
WORKDIR /app
# specify the release tag so we aren't running against latest.
RUN git clone -b 'ulid-v1.0' --depth 1 https://github.com/PHACDataHub/rust-tools
WORKDIR /app/rust-tools/tools/ulid
RUN cargo build --release


FROM mcr.microsoft.com/vscode/devcontainers/base:buster AS main_devcontainer

# [Option] Install zsh
ARG INSTALL_ZSH="true"
# [Option] Upgrade OS packages to their latest versions
ARG UPGRADE_PACKAGES="false"
# [Option] Enable non-root Docker access in container
ARG ENABLE_NONROOT_DOCKER="true"

# Install needed packages and setup non-root user. Use a separate RUN statement to add your own dependencies.
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG SOURCE_SOCKET=/var/run/docker-host.sock
ARG TARGET_SOCKET=/var/run/docker.sock
COPY library-scripts/*.sh /tmp/library-scripts/
RUN apt-get update \
    # Use Docker script from script library to set things up
    && /bin/bash /tmp/library-scripts/docker-debian.sh "${ENABLE_NONROOT_DOCKER}" "${SOURCE_SOCKET}" "${TARGET_SOCKET}" "${USERNAME}" \
    # Clean up
    && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /tmp/library-scripts/

# Setting the ENTRYPOINT to docker-init.sh will configure non-root access to 
# the Docker socket if "overrideCommand": false is set in devcontainer.json. 
# The script will also execute CMD if you need to alter startup behaviors.
ENTRYPOINT [ "/usr/local/share/docker-init.sh" ]

RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN apt-get update && apt-get install -y google-cloud-sdk

# [Optional] If you need kubectl command.
RUN apt-get install kubectl -y

# [Optional] If you need KPT command 
RUN apt-get install google-cloud-sdk-kpt

# [Optional] If you need vim and unuse nano.
RUN apt-get install vim -y && \
    unlink /etc/alternatives/editor && \
    ln -s /usr/bin/vim.basic /etc/alternatives/editor && \
    apt remove nano -y


# Switch to non-root user
USER ${USERNAME}

COPY library-scripts/bash-append.sh /tmp/library-scripts/
# Append to .bashrc for the vscode user
RUN /bin/bash /tmp/library-scripts/bash-append.sh 

# Need sudo to delete the shell script we copied.
RUN sudo rm -rf /tmp/library-scripts/

COPY --from=ulid_tool /app/rust-tools/tools/ulid/target/release/ulid /tmp/ulid
#RUN ["/bin/bash", "-c", "sudo cp /tmp/ulid $HOME/ulid"]

WORKDIR /app/gitBot
RUN ["/bin/bash", "-c", "sudo cp /tmp/ulid /app/gitBot/ulid"]
COPY . .

#Install node and npm
RUN sudo apt-get install curl software-properties-common -y
RUN sudo curl -sL https://deb.nodesource.com/setup_18.x | sudo bash - 
RUN sudo apt-get install nodejs 

RUN sudo npm install
CMD ["sudo","node","server.js"]