FROM python:3.10.1-slim

WORKDIR /ntprog_tt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN python -m pip install -r requirements.txt

COPY . .
