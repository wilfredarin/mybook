# myBook

Welcome to the **myBook** repository! This is the official repository for the myBook project.

## Getting Started

To get a copy of this project up and running on your local machine, follow the instructions below.

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (which includes npm)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:wilfredarin/mybook.git

2.  **Navigate to the project directory**

```sh
  cd mybook
```

3. **Install dependencies**

  ```sh
  npm install
```

### Environment Variables
This project requires a .env file in the root directory with the following variables:

```bash
JWT_SECRET=your_jwt_secret_key
DB_URL=your_database_url
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password
```

Make sure to replace the placeholder values with your actual configuration.

### Running the Project
To start the application, run:
```bash
node server.js
```
## Entry Point
The entry point for this application is server.js.

### Contributing
We welcome contributions! Please fork the repository and submit your pull requests for review.

### Contact
If you have any questions, feel free to open an issue or contact us at iamsameerranjan@gmail.com.
