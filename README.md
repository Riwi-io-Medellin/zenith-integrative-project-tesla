Zenith
======

Zenith is an educational platform designed to reward users for learning new
skills. Whether you want to master a programming language, art, or music,
Zenith makes education both motivating and accessible.

As a Gamified LMS (Learning Management System), Zenith integrates features like
daily streaks and interactive mini-games. The goal is to make the learning
journey easier, more engaging, and, above all, fun.

Objectives
----------
- Break the status quo: show that traditional education lacks engagement.
- Proof of concept: complex subjects can be learned through gamification.
- Build persistence: reward consistency and discipline, not just completion.
- Accessible mastery: make high-quality knowledge enjoyable and reachable.

Key Features
------------
- Dynamic course management: users create, manage, and enroll in courses.
- Hybrid architecture (MPA + SPA): multi-page navigation with SPA-like UX.
- Engagement-driven gamification:
  - Daily streaks to build learning habits.
  - Interactive mini-games to keep learning fun.

Technologies
------------
- Frontend: HTML5, CSS3, Tailwind (CDN), Bootstrap Icons.
- Backend: Node.js, Express, PostgreSQL (`pg`), Passport (Google OAuth),
  express-session, bcrypt.

Architecture
------------
Frontend Stack:
- HTML5 for semantic structure and navigation.
- CSS3 + custom styles for the Zenith look and feel.
- Tailwind CDN utility classes and Bootstrap Icons for UI components.

Backend Stack:
- Node.js + Express for the REST API.
- PostgreSQL via `pg` for persistence.
- Passport (Google OAuth) and sessions for authentication.
- bcrypt for password hashing.

Project Structure
-----------------
- `frontend/`: static pages, styles, and scripts.
- `backend/`: Express server, routes, controllers, and services.
- `.env.template`: environment variable reference.

Folders
-------
- `.vscode/`: editor settings for VS Code/Cursor.
- `backend/`: API, authentication, database, and server logic.
- `docs/`: documentation assets and reference materials.
- `frontend/`: HTML pages, CSS, JS, and static assets.
- `node_modules/`: installed dependencies (auto-generated).

How to Run the Project
----------------------
1) Install dependencies:
   - `npm install`

2) Create `.env` from the template and fill:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PWD`, `DB_SCHEMA`
   - `APP_PORT` (default 4000)
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` (optional)

3) Start the backend:
   - `npm start`

4) Serve the frontend with a static server (Live Server):
   - Open:
     - `http://127.0.0.1:5500/WirIntegration/frontend/templates/auth/index.html`
     - `http://127.0.0.1:5500/WirIntegration/frontend/templates/dashboard/dashboard.html`

API Overview
------------
Base URL: `http://127.0.0.1:4000`

- Auth:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/logout`
- User:
  - `GET /api/user/profile`
  - `PUT /api/user/profileput`
- Courses:
  - `GET /api/courses/categories`
  - `GET /api/courses/games`
  - `GET /api/courses/public`
  - `GET /api/courses/`
  - `POST /api/courses/`
  - `PUT /api/courses/:id`
  - `DELETE /api/courses/:id`
  - `POST /api/courses/games`
  - `POST /api/courses/join`
- Streak:
  - `GET /api/streak/status`
  - `PUT /api/streak/update-manual`
- Google OAuth:
  - `GET /auth/google`
  - `GET /auth/google/callback`

Notes
-----
- Google OAuth is optional. If `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is
  missing, the server starts without Google auth.
- Frontend routes are static files; make sure your static server uses the
  `WirIntegration` base path when opening pages locally.


Scrum Team Structure
----------------------

The development of the Zenith Project follows the Scrum agile methodology. The Scrum Team is composed of defined roles that collaborate to deliver product increments during each sprint while ensuring quality, efficiency, and continuous improvement.

-Product Owner (PO)
----------------------

Name: Estiven Mosquera

Main Responsibility:
Maximize the value of the product by managing the product vision and prioritizing development efforts according to business and user needs.

Key Responsibilities:

Manage and maintain the Product Backlog

Define and prioritize user stories

Clarify requirements for the development team

Represent stakeholders, clients, and business interests

Accept or reject completed deliverables based on acceptance criteria


-Scrum Master
--------------

Name: Estaban Bustamante

Main Responsibility:
Ensure that the Scrum framework is correctly implemented and that the development team can work efficiently without obstacles.

Key Responsibilities:

Facilitate Scrum ceremonies:

Sprint Planning

Daily Scrum

Sprint Review

Sprint Retrospective

Remove impediments that affect team productivity

Protect the development team from external interruptions

Promote continuous improvement within the team

Act as a coach and facilitator for agile practices

-Development Team
------------------

Members:

Sebastian Mosquera

Emmanuel Suarez

Role: Backend Developers

Main Responsibility:
Design, develop, and deliver the product increment at the end of each sprint.

Key Responsibilities:

Design system components and backend architecture

Develop and test application features

Estimate tasks and development effort

Collaborate and self-organize to meet sprint goals

Ensure functionality, reliability, and maintainability of the system


-QA Engineer (Quality Assurance)
--------------------------------

Name: Yolanda Gómez González

Main Responsibility:
Ensure that the product meets functional and non-functional requirements by validating quality, stability, and compliance with acceptance criteria before release.

Key Responsibilities:

Design and execute test cases

Validate user stories based on acceptance criteria

Identify, document, and track software defects (bugs)

Perform different types of testing:

Functional testing

Regression testing

Integration testing

Exploratory testing

Performance testing (when applicable)

Automate tests when possible

Verify compliance with quality standards

Collaborate in defining acceptance criteria

Participate in Scrum ceremonies:

Sprint Planning

Sprint Review

Sprint Retrospective

Validate that the product increment is ready for production release
