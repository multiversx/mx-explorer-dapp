# Use the official Node.js image
FROM node:20 AS build

# Set the working directory
WORKDIR /app

COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm run copy-placeholder-config & pnpm build

# Production image
FROM nginx:alpine

# Copy the build files to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html
COPY ./entrypoint.sh .
RUN chmod +x entrypoint.sh

# Expose port 80
EXPOSE 80
CMD ["./entrypoint.sh"]