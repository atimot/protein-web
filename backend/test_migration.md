# Migration System Test Guide

## Testing the Migration System

### 1. Start the application with Docker Compose
```bash
docker compose up -d
```

### 2. Check if migrations ran successfully
```bash
docker compose logs app
```

You should see logs like:
```
Applied migration 1: 001_create_users_table.up.sql
All migrations completed successfully
```

### 3. Verify database tables were created
```bash
docker compose exec db mysql -u root -p protein
```

Then run:
```sql
SHOW TABLES;
```

Expected output:
```
+-------------------+
| Tables_in_protein |
+-------------------+
| migration_history |
| users             |
+-------------------+
```

### 4. Check migration history
```sql
SELECT * FROM migration_history;
```

Expected output:
```
+---------+-------------------------------+---------------------+
| version | filename                      | applied_at          |
+---------+-------------------------------+---------------------+
|       1 | 001_create_users_table.up.sql | 2024-01-XX XX:XX:XX |
+---------+-------------------------------+---------------------+
```

### 5. Verify users table structure
```sql
DESCRIBE users;
```

Expected output:
```
+---------------+--------------+------+-----+-------------------+-------------------+
| Field         | Type         | Null | Key | Default           | Extra             |
+---------------+--------------+------+-----+-------------------+-------------------+
| id            | int          | NO   | PRI | NULL              | auto_increment    |
| email         | varchar(255) | NO   | UNI | NULL              |                   |
| password_hash | varchar(255) | NO   |     | NULL              |                   |
| name          | varchar(255) | YES  |     | NULL              |                   |
| created_at    | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
| updated_at    | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+---------------+--------------+------+-----+-------------------+-------------------+
```

## Migration System Features

### ✅ Implemented Features
1. **Automatic Migration Execution** - Runs on application startup
2. **Migration History Tracking** - Tracks applied migrations
3. **Transaction Safety** - Each migration runs in a transaction
4. **Rollback Support** - Can rollback the last migration
5. **Version Control** - Sequential version numbering
6. **Error Handling** - Proper error messages and logging

### 🔄 Usage
- **Add new migration**: Create `XXX_description.up.sql` and `XXX_description.down.sql`
- **Run migrations**: Start the application (automatic)
- **Rollback**: Use `migrationRunner.Rollback()` programmatically

### 📁 File Structure
```
backend/
├── migrations/
│   ├── 001_create_users_table.up.sql
│   ├── 001_create_users_table.down.sql
│   └── (future migrations...)
├── internal/
│   └── migration/
│       └── runner.go
└── cmd/server/main.go
```

## Next Steps

With the migration system in place, you can now:
1. Add user registration API endpoints
2. Implement password hashing
3. Add authentication middleware
4. Create additional database tables as needed

The migration system will automatically handle all database schema changes moving forward.