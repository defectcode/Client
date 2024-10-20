# Use Node.js official image as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Create a second stage for running the application
FROM node:18-alpine

# Set the working directory for the app
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Expose port 3000 for the app
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["yarn", "start"]
