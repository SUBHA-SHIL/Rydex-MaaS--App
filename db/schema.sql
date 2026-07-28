CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,

    role VARCHAR(20) CHECK (
        role IN ('RIDER', 'DRIVER')
    ) NOT NULL,

    phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE rides (
    id SERIAL PRIMARY KEY,

    rider_id INTEGER REFERENCES users(id),

    driver_id INTEGER REFERENCES users(id),

    origin TEXT NOT NULL,
    destination TEXT NOT NULL,

    origin_lat DOUBLE PRECISION,
    origin_lng DOUBLE PRECISION,

    destination_lat DOUBLE PRECISION,
    destination_lng DOUBLE PRECISION,

    status VARCHAR(30) CHECK (
        status IN (
            'SEARCHING',
            'ACCEPTED',
            'ONGOING',
            'COMPLETED',
            'CANCELLED'
        )
    ) DEFAULT 'SEARCHING',

    price NUMERIC(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE driver_locations (
    driver_id INTEGER PRIMARY KEY REFERENCES users(id),

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);