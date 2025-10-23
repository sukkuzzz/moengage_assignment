#!/bin/bash

# SQL Runner Startup Script

echo "🚀 Starting SQL Runner Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if database exists
if [ ! -f "sql_runner.db" ]; then
    echo "📊 Creating SQLite database with sample data..."
    sqlite3 sql_runner.db "
    -- Create the Customers table 
    CREATE TABLE Customers ( 
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        first_name VARCHAR(100), 
        last_name VARCHAR(100), 
        age INTEGER, 
        country VARCHAR(100) 
    ); 

    -- Insert sample data into Customers 
    INSERT INTO Customers (first_name, last_name, age, country) VALUES 
    ('John', 'Doe', 30, 'USA'), 
    ('Robert', 'Luna', 22, 'USA'), 
    ('David', 'Robinson', 25, 'UK'), 
    ('John', 'Reinhardt', 22, 'UK'), 
    ('Betty', 'Doe', 28, 'UAE'); 

    -- Create the Orders table 
    CREATE TABLE Orders ( 
        order_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        item VARCHAR(100), 
        amount INTEGER, 
        customer_id INTEGER, 
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) 
    ); 

    -- Insert sample data into Orders 
    INSERT INTO Orders (item, amount, customer_id) VALUES 
    ('Keyboard', 400, 4), 
    ('Mouse', 300, 4), 
    ('Monitor', 12000, 3), 
    ('Keyboard', 400, 1), 
    ('Mousepad', 250, 2); 

    -- Create the Shippings table 
    CREATE TABLE Shippings ( 
        shipping_id INTEGER PRIMARY KEY AUTOINCREMENT, 
        status VARCHAR(100), 
        customer INTEGER 
    ); 

    -- Insert sample data into Shippings 
    INSERT INTO Shippings (status, customer) VALUES 
    ('Pending', 2), 
    ('Pending', 4), 
    ('Delivered', 3), 
    ('Pending', 5), 
    ('Delivered', 1); 
    "
    echo "✅ Database created successfully!"
fi

echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 10

echo "✅ SQL Runner is now running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "🔑 Login Credentials:"
echo "   Username: admin"
echo "   Password: secret"
echo ""
echo "To stop the application, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"
