FROM mcr.microsoft.com/devcontainers/rust:1-1-bullseye AS ulid_tool
WORKDIR /app
# specify the release tag so we aren't running against latest.
RUN git clone -b 'ulid-v1.0' --depth 1 https://github.com/PHACDataHub/rust-tools
WORKDIR /app/rust-tools/tools/ulid
RUN cargo build --release

FROM debian
RUN apt-get update 
RUN apt-get install -y curl vim software-properties-common ca-certificates gnupg

#Install docker
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN chmod a+r /etc/apt/keyrings/docker.gpg
RUN echo  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

#Install gcloud and kpt
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN apt-get update && apt-get install -y google-cloud-sdk
RUN apt-get install -y google-cloud-sdk-kpt

#Install NodeJS and NPM
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install nodejs

COPY --from=ulid_tool /app/rust-tools/tools/ulid/target/release/ulid /tmp/ulid

WORKDIR /app/gitBot
RUN ["/bin/bash", "-c", "cp /tmp/ulid /app/gitBot/ulid"]
COPY . .

RUN npm install
CMD ["node","server.js"]