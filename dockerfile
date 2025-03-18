FROM node AS builder

# Set working directory
WORKDIR /usr/src/app

# Update package lists and install dependencies with better key management to avoid GPG errors
RUN apt-get update && \
    apt-get install -y curl gnupg2 ca-certificates && \
    curl -fsSL https://bun.sh/install | bash

# Copy all files from the host to the container
COPY . .

# Add bun to the PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Upgrade bun to the latest version
RUN bun upgrade

# Install production dependencies using bun
RUN bun install --production

# Set the environment to production
ENV NODE_ENV production

# Generate Prisma client
RUN bunx prisma generate

# Uncomment if you want to run migrations in the container
# RUN bunx prisma migrate dev --name init

# Expose the port your application will run on (adjust if needed)
EXPOSE 3000

# Command to run your application
CMD ["bun", "src/server.ts"]
