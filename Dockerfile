# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Set the environment variable for Flask
ENV FLASK_APP=app.py  # Replace with your actual entry point file

# Start the Flask application
CMD ["flask", "run", "--host=0.0.0.0"]
