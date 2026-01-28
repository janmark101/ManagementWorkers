import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from faker import Faker

# Importy Twoich modeli
from TeamsApi.models import Team, Task
from Chat.models import TeamMessage
from Authentication.models import UserProfile

# Stała dla powtarzalności wyników
SEED_VALUE = 42

# Ustawiamy locale na angielski
fake = Faker(['en_US'])

class Command(BaseCommand):
    help = 'Starting database seeder...'

    def handle(self, *args, **kwargs):
        # 1. USTAWIENIE SEEDA DLA POWTARZALNOŚCI
        random.seed(SEED_VALUE)
        Faker.seed(SEED_VALUE)

        self.stdout.write(self.style.WARNING('Clearing the database...'))

        # ---------------------------------------------------------
        # 0. CLEAR DB
        # ---------------------------------------------------------
        TeamMessage.objects.all().delete()
        Task.objects.all().delete()
        Team.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()


        self.stdout.write(self.style.WARNING('Starting seeding process...'))

        # ---------------------------------------------------------
        # 1. PRESENTER USER
        # ---------------------------------------------------------
        jan, created = User.objects.get_or_create(username='jankowalski')
        jan.first_name = 'Jan'
        jan.last_name = 'Kowalski'
        jan.email = 'jan.kowalski@example.com'
        jan.set_password('haslo123')
        jan.save()

        jan_profile, _ = UserProfile.objects.get_or_create(user=jan)
        jan_profile.is_verified = True
        jan_profile.save()

        self.stdout.write(self.style.SUCCESS(f'Presenter ready: {jan.username}'))

        # ---------------------------------------------------------
        # 2. DUMMY WORKERS
        # ---------------------------------------------------------
        users_pool = [jan]
        # Generujemy 15 pracowników
        for _ in range(15):
            profile_data = fake.simple_profile()
            username = profile_data['username']
            
            # guard against duplicate usernames
            if User.objects.filter(username=username).exists():
                continue

            u, created = User.objects.get_or_create(username=username)
            if created:
                name_parts = profile_data['name'].split(' ')
                u.first_name = name_parts[0]
                u.last_name = name_parts[1] if len(name_parts) > 1 else 'Doe'
                u.email = profile_data['mail']
                u.set_password('haslo123')
                u.save()
                
                up, _ = UserProfile.objects.get_or_create(user=u)
                up.is_verified = True
                up.save()
            
            users_pool.append(u)

        # ---------------------------------------------------------
        # 3. TEAMS CONFIGURATION
        # ---------------------------------------------------------
        teams_config = [
            ("Sales Department", True),          # Jan is Manager
            ("IT Support", False),               # Jan is Worker
            ("HR & Accounting", False),          # Jan is Worker
            ("Project: New HQ", True),           # Jan is Manager
        ]

        chat_messages_office = [
            "Is the sales report ready?",
            "The printer on the 2nd floor is jamming again.",
            "Pushing updates to the documentation.",
            "Thanks a lot!",
            "What time is the board meeting?",
            "I think it's at 2 PM in the conference room.",
            "Anyone ordering lunch today?",
            "I'm in for pizza.",
            "Sent the invoices for approval.",
            "I'll take a look in a minute.",
            "Clients are asking for the new price list.",
            "It's on the shared drive.",
            "Did you see the email from the CEO?",
            "Good job team!",
            "Can we reschedule the daily sync?",
            "Sure, no problem."
        ]

        task_names = [
            "Prepare quarterly presentation",
            "Key client meeting",
            "Update CRM database",
            "Order printer toners",
            "Expense report settlement",
            "Server data backup",
            "Competitor analysis",
            "Recruitment - CV review",
            "Fix navigation bug",
            "Update software license",
            "Organize team building event",
            "Call the supplier",
            "Review legal contract",
            "Design new logo drafts",
            "Monthly payroll check"
        ]

        for team_name, jan_is_manager in teams_config:
            manager = jan if jan_is_manager else random.choice(users_pool[1:])
            
            team, created = Team.objects.get_or_create(
                name=team_name,
                defaults={
                    'manager': manager,
                    'description': fake.bs().capitalize(),
                    'unique_code': str(random.randint(10000000, 99999999))[:8]
                }
            )

            # Workers (6-10 people per team)
            members = random.sample(users_pool, k=random.randint(6, 10))
            if jan not in members:
                members.append(jan)
            
            team.workers.set(members) 
            team.save()

            self.stdout.write(f'--- Seeding Team: {team.name} ---')

            # ---------------------------------------------------------
            # 4. TASKS GENERATION
            # ---------------------------------------------------------
            num_tasks = random.randint(80, 120)

            for _ in range(num_tasks):
                t_worker = random.choice(members)
                
                # task number gaussian distribution around today's date
                days_offset = int(random.gauss(0, 15))
                t_date = timezone.now() + timedelta(days=days_offset)

                if t_date.date() < timezone.now().date():
                    # future task status distribution
                    t_status = random.choices(
                        ["Done", "In progress", "Not started"], 
                        weights=[90, 8, 2], 
                        k=1
                    )[0]
                else:
                    # past task status distribution
                    t_status = random.choices(
                        ["Not started", "In progress", "Done"], 
                        weights=[70, 20, 10], 
                        k=1
                    )[0]
                
                task = Task.objects.create(
                    name=random.choice(task_names),
                    description=fake.sentence(),
                    status=t_status,
                    date=t_date,
                    team_id=team
                )
                task.workers_id.add(t_worker)

            # ---------------------------------------------------------
            # 5. CHAT MESSAGES
            # ---------------------------------------------------------
            for _ in range(random.randint(15, 30)):
                msg_sender = random.choice(members)
                msg_content = random.choice(chat_messages_office)
                
                # Last 4 days
                msg_date = timezone.now() - timedelta(days=random.randint(0, 4), hours=random.randint(0, 23))

                TeamMessage.objects.create(
                    team=team,
                    sender=msg_sender,
                    content=msg_content,
                    send_date=msg_date
                )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully.'))