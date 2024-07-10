# Valut-33

## Overview

This project is designed to showcase a comprehensive backend system with functionalities including API key management, tokenization services, and integration with external data sources. It's built with modern development practices in mind, aiming to provide a robust solution for managing secure data transactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (version 12 or newer)
- npm (comes bundled with Node.js)
- Redis (installation varies by operating system)

### Installation

Follow these steps to get your development environment set up:

1. **Clone the repo**: Use the command `git clone <repository-url>` to clone the repository to your local machine.
2. **Run a local Redis instance**: Ensure you have Redis installed and start a local instance. The default URL is `redis://localhost:6379`.
3. **Define the `.env` file**: Create a `.env` file in the root directory of the project and populate it with the following environment variables:
```
PORT=3000
NODE_ENV=development
ENCRYPTION_KEY=<256bit key>
JWT_SECRET=<256bit key>
JWT_ACCESS_EXPIRATION_MINUTES=30
ADMIN_ID=123
ADMIN_PASSWORD=123
ADMIN_ID_TEST=111
ADMIN_PASSWORD_TEST=222
REDIS_URL=redis://localhost:6379
REDIS_URL_TEST=redis://localhost:6379
```

4. **Start the process via `npm start`**
