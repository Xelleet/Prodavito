# 🛍️ Prodavito

A modern Django-based marketplace platform for buying, selling, and exchanging items. Prodavito enables users to create advertisements, propose exchanges, and communicate through an integrated messaging system.

![Django](https://img.shields.io/badge/Django-4.2.23-092E20?style=for-the-badge&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-3.14-FF1709?style=for-the-badge&logo=django&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

## ✨ Features

### 📢 Advertisement Management
- Create, read, update, and delete advertisements
- Categorize ads by type: **Техника** (Tech), **Автомобили** (Cars), **Работа** (Work)
- Mark items as **Новый** (New) or **Б/у** (Used)
- Search and filter functionality
- Image support via URL
- Pagination for better performance

### 🔄 Exchange System
- Propose exchanges between your items and others
- Track exchange proposal status: **Ожидает** (Pending), **Принята** (Accepted), **Отклонена** (Declined)
- View all your sent and received proposals
- Email notifications when proposals are accepted

### 💬 Messaging System
- Real-time chat between users
- Message read/unread status tracking
- Inbox view with all conversation partners
- RESTful API for frontend integration

### 👤 User Profiles
- Custom user profiles with avatars
- Bio section for user descriptions
- Secure authentication system

### 🔐 Authentication & Security
- JWT-based authentication with HttpOnly cookies
- CSRF protection
- CORS support for frontend integration
- Secure session management

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Prodavito
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install django==4.2.23
   pip install djangorestframework
   pip install djangorestframework-simplejwt
   pip install django-cors-headers
   ```

4. **Navigate to the project directory**
   ```bash
   cd prodavito
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

8. **Access the application**
   - Web interface: http://127.0.0.1:8000/
   - Admin panel: http://127.0.0.1:8000/admin/
   - API endpoints: http://127.0.0.1:8000/api/

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/register/
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "securepassword",
  "password2": "securepassword"
}
```

#### Login
```http
POST /api/login/
Content-Type: application/json

{
  "username": "user123",
  "password": "securepassword"
}
```

**Response:** Sets HttpOnly cookies (`access_token`, `refresh_token`, `csrftoken`)

#### Logout
```http
POST /api/logout/
```

#### Get Current User
```http
GET /api/me/
Authorization: Required (JWT in cookie)
```

### Advertisement Endpoints

#### List All Ads
```http
GET /api/ads/?q=search&category=tech&condition=new&page=1
```

**Query Parameters:**
- `q`: Search query (searches in title and description)
- `category`: Filter by category (`tech`, `cars`, `work`)
- `condition`: Filter by condition (`new`, `used`)
- `page`: Page number for pagination

#### Get Ad Detail
```http
GET /api/ads/{id}/
```

#### Create Ad
```http
POST /api/add_ad/
Content-Type: application/json
Authorization: Required

{
  "title": "iPhone 13 Pro",
  "description": "Brand new iPhone in perfect condition",
  "image_url": "https://example.com/image.jpg",
  "category": "tech",
  "condition": "new"
}
```

#### Update Ad
```http
PUT /api/ad_update/{id}/
Content-Type: application/json
Authorization: Required (must be ad owner)

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### Messaging Endpoints

#### Get Inbox
```http
GET /api/chat/inbox/
Authorization: Required
```

Returns list of users you've exchanged messages with.

#### Get Messages with User
```http
GET /api/chat/{user_id}/messages/
Authorization: Required
```

#### Send Message
```http
POST /api/chat/{user_id}/send/
Content-Type: application/json
Authorization: Required

{
  "content": "Hello! Is this item still available?"
}
```

## 🗂️ Project Structure

```
Prodavito/
├── prodavito/
│   ├── main/                    # Main application
│   │   ├── models.py           # Database models (Ad, ExchangeProposal, Message, Profile)
│   │   ├── views.py            # View logic (API and template views)
│   │   ├── serializers.py      # DRF serializers
│   │   ├── forms.py            # Django forms
│   │   ├── urls.py             # URL routing
│   │   ├── auth.py             # Custom authentication
│   │   ├── signals.py          # Django signals
│   │   ├── templates/          # HTML templates
│   │   │   ├── ads/           # Advertisement templates
│   │   │   ├── chat/          # Messaging templates
│   │   │   ├── exchange/      # Exchange proposal templates
│   │   │   └── ...
│   │   └── migrations/         # Database migrations
│   ├── prodavito/              # Project settings
│   │   ├── settings.py        # Django settings
│   │   ├── urls.py            # Root URL configuration
│   │   └── wsgi.py            # WSGI configuration
│   ├── db.sqlite3              # SQLite database
│   └── manage.py               # Django management script
└── README.md
```

## 🗄️ Database Models

### Ad
- `title`: Advertisement title
- `description`: Detailed description
- `image_url`: URL to item image
- `category`: One of `tech`, `cars`, `work`
- `condition`: One of `new`, `used`
- `user`: Foreign key to User
- `created_at`: Timestamp

### ExchangeProposal
- `ad_sender`: Ad being offered
- `ad_receiver`: Ad being requested
- `comment`: Optional comment
- `status`: `pending`, `accepted`, or `declined`
- `created_at`: Timestamp

### Message
- `sender`: User sending the message
- `receiver`: User receiving the message
- `content`: Message text
- `is_read`: Read status
- `created_at`: Timestamp

### Profile
- `user`: One-to-one with User
- `avatar`: Profile image
- `bio`: User biography

## 🔧 Configuration

### CORS Settings
The project is configured to allow requests from `http://localhost:3000` (typical React/Next.js development server). To change this, update `CORS_ALLOWED_ORIGINS` in `settings.py`.

### JWT Settings
- Access token lifetime: 5 minutes
- Refresh token lifetime: 30 days
- Tokens are stored in HttpOnly cookies for security

### Database
Currently using SQLite. For production, consider switching to PostgreSQL or MySQL by updating `DATABASES` in `settings.py`.

## 🧪 Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Accessing Django Admin
1. Create a superuser: `python manage.py createsuperuser`
2. Navigate to: http://127.0.0.1:8000/admin/
3. Login with your superuser credentials

## 🛠️ Technologies Used

- **Django 4.2.23** - Web framework
- **Django REST Framework** - API development
- **djangorestframework-simplejwt** - JWT authentication
- **django-cors-headers** - CORS handling
- **SQLite** - Database (development)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

Developed with ❤️ using Django

---

**Note:** This is a development version. For production deployment, ensure to:
- Set `DEBUG = False`
- Configure proper `ALLOWED_HOSTS`
- Use a production database (PostgreSQL recommended)
- Set up proper static file serving
- Configure HTTPS
- Update security settings in `settings.py`

