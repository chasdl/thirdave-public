# thirdave-prayer

## App

* Currently live at https://prayer.thirdavenue.org/login

## Backend Requirements

* Docker
* Docker Compose

## Frontend Requirements

* Node.js (with `npm`)

## Backend local development

* Start the stack with Docker Compose:

```bash
docker-compose up -d
```

### Migrations

```bash
docker-compose exec backend bash
```

* After changing a model, inside the container, create a revision, e.g.:

```bash
alembic revision --autogenerate -m "Add column last_name to User model"
```

* Commit to the git repository the files generated in the alembic directory.

* Run the migration in the database:

```bash
alembic upgrade head
```

## Frontend development

* Enter the `frontend` directory, install the NPM packages and start the live server using the `npm` scripts:

```bash
cd frontend
npm install
npm run serve
```
