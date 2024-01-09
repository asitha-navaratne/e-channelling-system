DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
	id SERIAL,
	email VARCHAR(255) NOT NULL UNIQUE,
	title VARCHAR(5) CONSTRAINT valid_title CHECK (title in ('Mr.', 'Mrs.', 'Ms.', 'Master', 'Miss', 'Dr.', 'Rev.')),
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	phone_number VARCHAR(12),
	address VARCHAR(255),
	nic VARCHAR(15),
	user_role VARCHAR(10) CONSTRAINT valid_user_role CHECK (user_role in ('admin', 'user')),
	hashed_password VARCHAR(255) NOT NULL,
	created_dttm TIMESTAMP,
	updated_dttm TIMESTAMP,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS doctors CASCADE;

CREATE TABLE doctors (
	id SERIAL,
	email VARCHAR(255) NOT NULL UNIQUE,
	first_name VARCHAR(100),
	last_name VARCHAR(100),
	field VARCHAR(50),
	phone_number VARCHAR(12),
	address VARCHAR(255),
	nic VARCHAR(15),
	hashed_password VARCHAR(255) NOT NULL,
	created_dttm TIMESTAMP,
	updated_dttm TIMESTAMP,
	PRIMARY KEY (id)
);

DROP TABLE IF EXISTS appointments;

CREATE TABLE appointments (
	id SERIAL,
	user_id INTEGER,
	doctor_id INTEGER,
	appointment_dttm TIMESTAMP,
	created_dttm TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES users(id),
	FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

DROP TABLE IF EXISTS availability;

CREATE TABLE availability (
	id SERIAL,
	doctor_id INTEGER,
	start_time TIMESTAMP,
	end_time TIMESTAMP,
	created_dttm TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);