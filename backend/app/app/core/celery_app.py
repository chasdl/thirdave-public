from celery import Celery
from celery.schedules import crontab

celery_app = Celery("worker", broker="amqp://guest@queue//")

celery_app.conf.task_routes = {"app.worker.queue_emails": "main-queue",
                              "app.worker.sync_members" : "main-queue",
                              "app.worker.refresh_partner_urls": "main-queue",
                              "app.worker.queue_partner_emails": "main-queue"
                              }

celery_app.conf.beat_schedule = {
    # Executes every morning (except Sat) at 7 a.m.
    'queue-emails-every-morning': {
        'task': 'app.worker.queue_emails',
        'schedule': crontab(hour=7, minute=0, day_of_week='monday,tuesday,wednesday,thursday,friday,sunday'),
        'options': {'queue' : 'main-queue'},
        'args': (),
    },
    # Executes midnight every sunday, thursday, at midnight
    'sync-members-every-sunday-thursday-midnight': {
        'task': 'app.worker.sync_members',
        'schedule': crontab(hour=0, minute=0, day_of_week='sunday,thursday'),
        'options': {'queue' : 'main-queue'},
        'args': (),
    },
    # Executes midnight every monday, firday, at midnight
    'refresh-partner-images-every-monday-friday-midnight': {
        'task': 'app.worker.refresh_partner_urls',
        'schedule': crontab(hour=0, minute=0, day_of_week='monday,friday'),
        'options': {'queue' : 'main-queue'},
        'args': (),
    },
    # Executes 7am Saturdays
    'send-partner-emails-saturdays': {
        'task': 'app.worker.queue_partner_emails',
        'schedule': crontab(hour=7, minute=0, day_of_week='saturday'),
        'options': {'queue' : 'main-queue'},
        'args': (),
    },
}
celery_app.conf.timezone = 'America/Kentucky/Louisville'