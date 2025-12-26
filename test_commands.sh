# A. Get All Students
curl -X GET "https://potential-space-garbanzo-9vvgrgg65j6cj5v-8000.app.github.dev/api/students"

# B. Get One Student
curl -X GET "http://localhost:8000/api/students/1"

# C. Create Student
curl -X POST "http://localhost:8000/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "course": "Computer Science",
    "year": 2
  }'

# D. Update Student
curl -X PUT "http://localhost:8000/api/students/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Updated",
    "email": "alice_new@example.com",
    "course": "Data Science",
    "year": 3
  }'

# E. Delete Student
curl -X DELETE "http://localhost:8000/api/students/1"


##################### DB Observation Via SQLite Web
- install https://github.com/coleifer/sqlite-web
- pip install sqlite-web
- sqlite_web students.db


# A. Get All Teachers
curl -X GET "http://localhost:8000/api/teachers"

# B. Get One Teacher
curl -X GET "http://localhost:8000/api/teachers/1"

# C. Create Teacher
curl -X POST "http://localhost:8000/api/teachers" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "subject": "Mathematics",
    "department": "Science"
  }'

# D. Update Teacher
curl -X PUT "http://localhost:8000/api/teachers/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Updated",
    "email": "john.smith.updated@example.com",
    "subject": "Physics",
    "department": "Science and Technology"
  }'

# E. Delete Teacher
curl -X DELETE "http://localhost:8000/api/teachers/1"


##################### DB Observation Via SQLite Web
# (same as students if using same DB file)
# if both tables are stored in students.db
sqlite_web students.db

# or if teachers stored separately:
# sqlite_web teachers.db
