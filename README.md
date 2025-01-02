<h1 align="center" id="title">Task Management System</h1>

<p id="description">The Task Management Application is a full-stack web application designed to streamline task allocation tracking and management across teams. It supports three distinct user roles: Admin Manager and Regular User each with specific permissions and functionalities tailored to their responsibilities. This project is designed with scalability and role-based access control in mind ensuring that every user interacts with the system according to their role. The application serves as an efficient tool for managing day-to-day tasks enhancing productivity and promoting collaboration within organizations.</p>

## 🚀 Demo

### Frontend Live URL:
[https://task-management-system-livid.vercel.app/](https://task-management-system-livid.vercel.app/)

### Backend Live URL:
[https://backend.syedtalhahussain.com/test](https://backend.syedtalhahussain.com/test)

I have deployed the frontend on Vercel and the backend on AWS Elastic Beanstalk with SSL activation, and I created a subdomain for the backend URL.


<p>4. If you want to run the backend from a local development server, add the following key in the client `.env` file and change condition in Context folder in react to :</p>

```
VITE_BACKEND_API_URL='your backend server url '
```

<p>5. and change condition in Context folder in react to :</p>

```
const BASE_URL = import.meta.env.VITE_PRODUCTION_API_URL   to   const BASE_URL = import.meta.env.VITE_BACKEND_API_URL
```




  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   User Assigning to Roles
*   Assigned Users Management
*   Authentication & Authorization
*   Role-Based Access Control (RBAC)
*   Task Management

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repository:</p>

```
git clone https://github.com/SyedTalha71x/Task-Management-System.git
```

<p>2. Install dependencies for both frontend and backend:</p>

```
npm install
```

<p>3. Configure environment variables for your database and authentication in the server .env file.</p>

```
DATABASE_URL=
```

```
PORT=
```

```
JWT_SECRET=
```

<p>6. Start the Frontend : </p>

```
npm run dev
```

<p>7. Start the Backend : </p>

```
npm start
```


  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   React
*   NodeJs
*   MongoDB
*   ExpressJs

