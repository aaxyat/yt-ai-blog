YouTube Blog Generator API
==========================

A powerful Django REST API that converts YouTube videos into professional blog posts using AI.

.. image:: https://img.shields.io/badge/Python-3.12-blue.svg
   :target: https://www.python.org/downloads/release/python-3120/

.. image:: https://img.shields.io/badge/Django-5.0-green.svg
   :target: https://www.djangoproject.com/

.. image:: https://img.shields.io/badge/DRF-3.14-red.svg
   :target: https://www.django-rest-framework.org/

Features
--------

🚀 Core Features
~~~~~~~~~~~~~~~~
- **AI-Powered Blog Generation**: Convert YouTube videos into well-structured blog posts
- **Email Authentication**: Secure email-based authentication with JWT tokens
- **Invite-Only Registration**: Control user access with invite codes
- **Theme Preferences**: Support for light/dark UI themes
- **Admin Controls**: Comprehensive user and invite management

🔐 Security
~~~~~~~~~~~
- JWT-based authentication
- Invite-only registration system
- Role-based access control
- Secure password handling

🛠️ Technical Stack
~~~~~~~~~~~~~~~~~~
- Django 5.0
- Django REST Framework
- Groq AI (Mixtral-8x7b)
- JWT Authentication
- SQLite Database

Installation
------------

1. Clone the repository:
   
   .. code-block:: bash

      git clone <repository-url>
      cd backend

2. Install Poetry:
   
   .. code-block:: bash

      curl -sSL https://install.python-poetry.org | python3 -

3. Install dependencies:
   
   .. code-block:: bash

      poetry install

4. Set up environment variables:
   
   Create a .env file with:

   .. code-block:: bash

      SECRET_KEY=your-secret-key
      OPENAI_API_KEY=your-groq-api-key
      OPENAI_BASE_URL=https://api.groq.com/openai/v1
      OPENAI_MODEL=mixtral-8x7b-32768

5. Run migrations:
   
   .. code-block:: bash

      poetry run python manage.py migrate

6. Create superuser:
   
   .. code-block:: bash

      poetry run python manage.py createsuperuser

7. Run the development server:
   
   .. code-block:: bash

      poetry run python manage.py runserver

API Documentation
-----------------

The API documentation is available at:

- Swagger UI: ``/docs/``
- ReDoc: ``/redoc/``
- OpenAPI Schema: ``/schema/``

Key Endpoints
~~~~~~~~~~~~~~

Authentication
^^^^^^^^^^^^^^
- ``POST /api/auth/register/``: Register new user (invite required)
- ``POST /api/auth/token/``: Get JWT tokens
- ``POST /api/auth/token/refresh/``: Refresh JWT token

Blog Management
^^^^^^^^^^^^^^^
- ``POST /api/blog/generate-from-youtube/``: Generate blog from video
- ``GET /api/blog/my-blogs/``: List user's blogs
- ``GET /api/blog/my-blogs/<id>/``: View specific blog
- ``DELETE /api/blog/my-blogs/<id>/``: Delete blog

Admin Controls
^^^^^^^^^^^^^^
- ``GET /api/management/stats/``: System statistics (superuser only)
- ``POST /api/management/invites/``: Generate invite codes
- ``GET /api/management/users/``: List all users
- ``POST /api/management/ban/``: Ban users

Development
-----------

Running Tests
~~~~~~~~~~~~~
.. code-block:: bash

   poetry run python manage.py test

Code Style
~~~~~~~~~~
We use Black and isort for code formatting:

.. code-block:: bash

   poetry run black .
   poetry run isort .

Contributing
------------

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

License
-------

This project is licensed under the MIT License.

Author
------

Ayush Bhattarai 