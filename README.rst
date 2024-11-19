YT Blog - AI-Powered YouTube Blog Generator
===========================================

.. image:: https://img.shields.io/badge/Python-3.12-blue.svg
   :target: https://www.python.org/downloads/release/python-3120/

.. image:: https://img.shields.io/badge/Django-5.0-green.svg
   :target: https://www.djangoproject.com/

.. image:: https://img.shields.io/badge/React-18-blue.svg
   :target: https://reactjs.org/

.. image:: https://img.shields.io/badge/License-MIT-yellow.svg
   :target: https://opensource.org/licenses/MIT

YT Blog is a powerful web application that automatically converts YouTube videos into professional blog posts using AI technology. It features a Django REST API backend and a modern React frontend.

🚀 Features
-----------

- **AI Blog Generation**: Convert YouTube videos into well-structured blog posts
- **JWT Authentication**: Secure email-based authentication system
- **Invite-Only Access**: Controlled user registration through invite codes
- **Theme Support**: Light/dark mode UI themes
- **Admin Dashboard**: Comprehensive user and content management
- **Responsive Design**: Mobile-friendly interface
- **Markdown Support**: Rich text formatting for blog content

🛠️ Tech Stack
-------------

Backend
~~~~~~~
- Django 5.0
- Django REST Framework
- Groq AI (Mixtral-8x7b)
- JWT Authentication
- SQLite Database

Frontend
~~~~~~~~
- React 18
- Tailwind CSS
- React Query
- React Router
- React Hook Form
- Radix UI
- Axios

📦 Installation
----------------

Backend Setup
~~~~~~~~~~~~

1. Clone the repository:

   .. code-block:: bash

      git clone https://github.com/aaxyat/yt-blog.git
      cd yt-blog/backend

2. Install Poetry and dependencies:

   .. code-block:: bash

      curl -sSL https://install.python-poetry.org | python3 -
      poetry install

3. Configure environment:

   Create a ``.env`` file with:

   .. code-block:: bash

      SECRET_KEY=your-secret-key
      OPENAI_API_KEY=your-groq-api-key
      OPENAI_BASE_URL=https://api.groq.com/openai/v1
      OPENAI_MODEL=mixtral-8x7b-32768

4. Setup database:

   .. code-block:: bash

      poetry run python manage.py migrate
      poetry run python manage.py createsuperuser

Frontend Setup
~~~~~~~~~~~~~~

1. Navigate to frontend directory:

   .. code-block:: bash

      cd ../frontend

2. Install dependencies:

   .. code-block:: bash

      pnpm install

3. Configure environment:

   Create a ``.env`` file with:

   .. code-block:: bash

      VITE_API_URL=http://localhost:8000/api

4. Start development servers:

   Backend:
   
   .. code-block:: bash

      # In backend directory
      poetry run python manage.py runserver

   Frontend:
   
   .. code-block:: bash

      # In frontend directory
      pnpm dev

🔍 API Documentation
--------------------

Access the API documentation at:

- Swagger UI: ``/docs/``
- ReDoc: ``/redoc/``
- OpenAPI Schema: ``/schema/``

Key Endpoints
~~~~~~~~~~~~~

- ``POST /api/auth/register/``: User registration
- ``POST /api/auth/token/``: JWT token generation
- ``POST /api/blog/generate-from-youtube/``: Blog generation
- ``GET /api/blog/my-blogs/``: User's blog listing
- ``GET /api/management/stats/``: System statistics (admin)

👥 Contributing
---------------

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

Please ensure your code follows our style guidelines and includes appropriate tests.

📝 License
---------

This project is licensed under the MIT License.

👤 Author
---------

**Ayush Bhattarai**

- GitHub: `@aaxyat <https://github.com/aaxyat>`_