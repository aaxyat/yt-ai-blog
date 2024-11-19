YT Blog Frontend
===============

The React-based frontend for the YT Blog application.

Overview
--------
This is the frontend component of the YT Blog application, built with React and modern web technologies. It provides a user interface for blog generation from YouTube videos, user management, and admin controls.

Tech Stack
----------

* **React 18**: Core framework
* **Tailwind CSS**: Styling and UI components
* **React Query**: Data fetching and caching
* **React Router**: Navigation
* **React Hook Form**: Form handling
* **React Markdown**: Content rendering
* **Axios**: API communication
* **Zod**: Schema validation
* **Radix UI**: Accessible components
* **Lucide Icons**: Icon system

Prerequisites
------------
* Node.js 18+
* pnpm
* Backend API running on ``localhost:8000``

Installation
-----------

1. Install dependencies::

    pnpm install

2. Create ``.env`` file::

    VITE_API_URL=http://localhost:8000/api

3. Start development server::

    pnpm dev

Project Structure
---------------

::

    src/
    ├── components/         # Reusable UI components
    │   ├── auth/          # Authentication components
    │   ├── layout/        # Layout components
    │   └── ui/            # UI components
    ├── lib/               # Utilities and API services
    ├── pages/             # Page components
    ├── providers/         # Context providers
    └── styles/            # Global styles

Key Features
-----------

* JWT Authentication
* Blog Generation Interface
* User Dashboard
* Admin Controls
* Theme Customization
* Responsive Design
* Markdown Support

Development
----------

Commands::

    # Start development server
    pnpm dev

    # Build for production
    pnpm build

    # Preview production build
    pnpm preview

    # Run linting
    pnpm lint

Configuration
------------

* ``vite.config.js``: Vite configuration
* ``tailwind.config.js``: Tailwind CSS configuration
* ``package.json``: Dependencies and scripts
* ``.env``: Environment variables

Contributing
-----------

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See the main project README for complete documentation and backend setup instructions.

----

Part of the `YT Blog <https://github.com/yourusername/yt-blog>`_ project. 